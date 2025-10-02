#!/bin/bash

# CLI Validation Script for Task 8
# Tests all CLI functionality to ensure MVP requirements are met

set -e  # Exit on error

echo "======================================"
echo "Task 8: CLI Validation Tests"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
test_cli() {
    local test_name="$1"
    local command="$2"
    local expected_exit="$3"
    
    echo -n "Testing: $test_name... "
    
    if eval "$command" > /dev/null 2>&1; then
        actual_exit=0
    else
        actual_exit=1
    fi
    
    if [ "$actual_exit" -eq "$expected_exit" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected exit $expected_exit, got $actual_exit)"
        ((FAILED++))
        return 1
    fi
}

echo "1. Building CLI..."
REPO_ROOT=$(pwd)
cd packages/commitly-cli
pnpm build > /dev/null 2>&1
CLI_PATH="$REPO_ROOT/packages/commitly-cli/dist/index.js"
echo -e "${GREEN}✓${NC} CLI built successfully"
echo ""

echo "2. Testing CLI Commands"
echo "----------------------"

# Create test directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Helper function to run CLI
run_cli() {
    node "$CLI_PATH" "$@"
}

# Test 1: lint command with valid message
echo "feat: test message" > test-msg.txt
test_cli "lint valid message" "run_cli lint -f test-msg.txt" 0

# Test 2: lint command with invalid message
echo "invalid message" > test-msg.txt
test_cli "lint invalid message" "run_cli lint -f test-msg.txt" 1

# Test 3: lint with missing type
echo "add new feature" > test-msg.txt
test_cli "lint missing type" "run_cli lint -f test-msg.txt" 1

# Test 4: lint with trailing period
echo "feat: add feature." > test-msg.txt
test_cli "lint trailing period" "run_cli lint -f test-msg.txt" 1

# Test 5: lint with wrong case
echo "feat: Add Feature" > test-msg.txt
test_cli "lint wrong case" "run_cli lint -f test-msg.txt" 1

# Test 6: lint with scope
echo "feat(auth): add login" > test-msg.txt
test_cli "lint with scope" "run_cli lint -f test-msg.txt" 0

# Test 7: lint breaking change
echo "feat!: breaking change" > test-msg.txt
test_cli "lint breaking change" "run_cli lint -f test-msg.txt" 0

# Test 8: check command with valid message
test_cli "check valid message" "run_cli check 'feat: test message'" 0

# Test 9: check command with invalid message
test_cli "check invalid message" "run_cli check 'invalid message'" 1

echo ""
echo "3. Testing Fix Command"
echo "----------------------"

# Test 10: fix trailing period
echo "feat: add feature." > test-msg.txt
run_cli fix -f test-msg.txt > /dev/null 2>&1
if grep -q "feat: add feature$" test-msg.txt; then
    echo -e "${GREEN}✓ PASS${NC} fix trailing period"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} fix trailing period"
    ((FAILED++))
fi

# Test 11: fix case
echo "feat: Add Feature" > test-msg.txt
run_cli fix -f test-msg.txt > /dev/null 2>&1
if grep -q "feat: add Feature" test-msg.txt; then
    echo -e "${GREEN}✓ PASS${NC} fix case"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} fix case"
    ((FAILED++))
fi

# Test 12: infer type
echo "Add new feature" > test-msg.txt
run_cli fix -f test-msg.txt > /dev/null 2>&1
if grep -q "^feat:" test-msg.txt; then
    echo -e "${GREEN}✓ PASS${NC} infer type from verb"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} infer type from verb"
    ((FAILED++))
fi

echo ""
echo "4. Testing Hook Installation"
echo "----------------------------"

# Create a git repo
git init > /dev/null 2>&1
git config user.name "Test User" > /dev/null 2>&1
git config user.email "test@example.com" > /dev/null 2>&1

# Install hooks
run_cli init-hooks > /dev/null 2>&1

# Check if hook was created
if [ -f ".git/hooks/commit-msg" ]; then
    echo -e "${GREEN}✓ PASS${NC} hook file created"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} hook file not created"
    ((FAILED++))
fi

# Check if hook is executable
if [ -x ".git/hooks/commit-msg" ]; then
    echo -e "${GREEN}✓ PASS${NC} hook is executable"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} hook not executable"
    ((FAILED++))
fi

# Check hook content
if grep -q "commitly lint" ".git/hooks/commit-msg"; then
    echo -e "${GREEN}✓ PASS${NC} hook contains correct command"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} hook missing correct command"
    ((FAILED++))
fi

# Cleanup
cd -
rm -rf "$TEST_DIR"

echo ""
echo "======================================"
echo "CLI Validation Summary"
echo "======================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "${GREEN}Failed: 0${NC}"
fi

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All CLI validation tests passed!${NC}"
    echo -e "${GREEN}✓ CLI is production-ready${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

