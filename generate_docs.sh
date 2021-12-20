#!/bin/bash -e

# Get the last commit author email
LAST_COMMIT_BY=$(git log -1 --pretty=%ae)

echo "Last commit made by $LAST_COMMIT_BY"

# Only run if the commit was not made by ci user
if [ "$LAST_COMMIT_BY" == "devonly@a24group.com" ]; then
    echo "Commit made by ci user, no further actions"
    exit 0;
fi

# Get the git branch that we are on
echo "Branch identified as $GIT_BRANCH"
if [ "$GIT_BRANCH" == "master" ]; then
    echo "Master branch will not generate docs"
    exit 0;
fi

# Generate the docs
npm run dev-generate-event-docs

# Check if the Events.md was changed
REGENERATED=$( git status -s | grep "Events.md" )

if [ -z "$REGENERATED" ]; then
    echo "Events.md had no changes"
    exit: 0;
fi

# Changes seen on Events.md file
echo "Setting git globals..."
git config --global user.name "CI"
git config --global user.email "devonly@a24group.com"
echo "Adding files..."
git add Events.md
echo "Comitting..."
git commit -m 'Update event documentation'
echo "Pushing..."
git push git@github.com:A24Group/staffshift-agency-client-management.git $GIT_BRANCH
echo "Pushed"
