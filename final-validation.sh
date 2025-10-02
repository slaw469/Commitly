#!/bin/bash

# Final MVP Validation Script - Task 8
# Runs comprehensive checks 3 times as required

set -e

echo "========================================="
echo "Task 8: Final MVP Validation"
echo "3x Validation Rounds Required"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Check function
check() {
    local name="$1"
    local command="$2"
    
    ((TOTAL_CHECKS++))
    echo -n "  Checking $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((PASSED_CHECKS++))
        return 0
    else
        echo -e "${RED}✗${NC}"
        ((FAILED_CHECKS++))
        return 1
    fi
}

# Run validation round
run_validation_round() {
    local round=$1
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Validation Round $round of 3${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Reset counters for this round
    ROUND_TOTAL=0
    ROUND_PASSED=0
    ROUND_FAILED=0
    
    echo "1. Code Quality Checks"
    echo "----------------------"
    check "TypeScript compilation" "pnpm typecheck"
    check "Linter passing" "pnpm lint"
    check "Prettier formatting" "pnpm format:check"
    
    echo ""
    echo "2. Build Verification"
    echo "---------------------"
    check "Core package builds" "pnpm --filter @commitly/core build"
    check "CLI package builds" "pnpm --filter @commitly/cli build"
    check "Web app builds" "pnpm --filter @commitly/web build"
    
    echo ""
    echo "3. Test Suites"
    echo "--------------"
    check "Core tests pass" "pnpm --filter @commitly/core test"
    check "CLI tests pass" "pnpm --filter @commitly/cli test"
    
    echo ""
    echo "4. Package Integrity"
    echo "--------------------"
    check "Core package.json valid" "node -e \"require('./packages/commitly-core/package.json')\""
    check "CLI package.json valid" "node -e \"require('./packages/commitly-cli/package.json')\""
    check "Web package.json valid" "node -e \"require('./apps/commitly-web/package.json')\""
    
    echo ""
    echo "5. Documentation"
    echo "----------------"
    check "README exists" "test -f README.md"
    check "CHANGELOG exists" "test -f CHANGELOG.md"
    check "LICENSE exists" "test -f LICENSE"
    
    echo ""
    echo "6. Build Artifacts"
    echo "------------------"
    check "Core dist exists" "test -d packages/commitly-core/dist"
    check "CLI dist exists" "test -d packages/commitly-cli/dist"
    check "Web dist exists" "test -d apps/commitly-web/dist"
    
    echo ""
    echo "7. Configuration Files"
    echo "----------------------"
    check "vercel.json exists" "test -f apps/commitly-web/vercel.json"
    check "tsconfig.base.json exists" "test -f tsconfig.base.json"
    check "pnpm-workspace.yaml exists" "test -f pnpm-workspace.yaml"
    
    echo ""
    echo "8. Git Health"
    echo "-------------"
    check "No uncommitted changes" "git diff --quiet HEAD"
    check "On main branch" "[[ \$(git branch --show-current) == 'main' ]]"
    check "Up to date with remote" "git fetch origin && git diff --quiet HEAD origin/main"
    
    echo ""
    echo -e "${BLUE}Round $round Summary:${NC}"
    echo -e "  Total Checks: $TOTAL_CHECKS"
    echo -e "  ${GREEN}Passed: $PASSED_CHECKS${NC}"
    
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo -e "  ${RED}Failed: $FAILED_CHECKS${NC}"
    else
        echo -e "  ${GREEN}Failed: 0${NC}"
    fi
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "  ${GREEN}Status: ✓ ALL CHECKS PASSED${NC}"
        return 0
    else
        echo -e "  ${RED}Status: ✗ SOME CHECKS FAILED${NC}"
        return 1
    fi
}

# Main execution
REPO_ROOT=$(pwd)
cd "$REPO_ROOT"

echo "Starting 3-Round Validation Process..."
echo ""

ROUND1_RESULT=0
ROUND2_RESULT=0
ROUND3_RESULT=0

# Round 1
run_validation_round 1
ROUND1_RESULT=$?

# Brief pause between rounds
sleep 2

# Round 2
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
run_validation_round 2
ROUND2_RESULT=$?

# Brief pause between rounds
sleep 2

# Round 3
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
run_validation_round 3
ROUND3_RESULT=$?

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Final Validation Results${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Round Results:"
if [ $ROUND1_RESULT -eq 0 ]; then
    echo -e "  Round 1: ${GREEN}✓ PASSED${NC}"
else
    echo -e "  Round 1: ${RED}✗ FAILED${NC}"
fi

if [ $ROUND2_RESULT -eq 0 ]; then
    echo -e "  Round 2: ${GREEN}✓ PASSED${NC}"
else
    echo -e "  Round 2: ${RED}✗ FAILED${NC}"
fi

if [ $ROUND3_RESULT -eq 0 ]; then
    echo -e "  Round 3: ${GREEN}✓ PASSED${NC}"
else
    echo -e "  Round 3: ${RED}✗ FAILED${NC}"
fi

echo ""

# Overall result
if [ $ROUND1_RESULT -eq 0 ] && [ $ROUND2_RESULT -eq 0 ] && [ $ROUND3_RESULT -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✓✓✓ ALL 3 VALIDATION ROUNDS PASSED ✓✓✓${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}✓ Project is PRODUCTION READY${NC}"
    echo -e "${GREEN}✓ All MVP requirements met${NC}"
    echo -e "${GREEN}✓ Ready for deployment to Vercel${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ✗ SOME VALIDATION ROUNDS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Review failed checks and fix issues before deployment${NC}"
    echo ""
    exit 1
fi

