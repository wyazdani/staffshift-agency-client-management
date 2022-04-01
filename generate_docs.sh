#!/bin/bash -e

# Get the last commit author email
LAST_COMMIT_BY=$(git log -1 --pretty=%ae)

echo "Last commit made by $LAST_COMMIT_BY"

# Exit process if commit was made by ci user
if [ "$LAST_COMMIT_BY" == "devonly@a24group.com" ]; then
    echo "Commit made by ci user, no further actions"
    exit 0;
fi

echo "Branch identified as $GIT_BRANCH"

# Exit the process when branch is not set, this will be the case when a tag is pushed
if [ -z "$GIT_BRANCH" ]; then
    echo "Tags will not generate docs"
    exit 0;
fi

# Exit the process if it's master branch
if [ "$GIT_BRANCH" == "master" ]; then
    echo "Master branch will not generate docs"
    exit 0;
fi

# Generate the docs
npm run dev-generate-event-docs

# Check if the Events.md was changed
REGENERATED=$( git status -s | grep "Events.md" || true)

if [ -z "$REGENERATED" ]; then
    echo "Events.md had no changes"
    exit 0;
fi

# Changes seen on Events.md file
echo "Setting git globals..."
git config --global user.name "CI"
git config --global user.email "devonly@a24group.com"
echo "Adding files..."
git add Events.md
echo "Committing..."
git commit -m 'Update event documentation'
echo "Pushing..."
git push git@github.com:A24Group/staffshift-agency-client-management.git HEAD:$GIT_BRANCH
echo "Pushed"
