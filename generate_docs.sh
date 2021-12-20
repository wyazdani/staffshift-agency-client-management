#!/bin/bash -e

# Get the last commit author email
LAST_COMMIT_BY=$(git log -1 --pretty=%ae)

# Only run if the commit was not made by ci user
if [ "$LAST_COMMIT_BY" == "devonly@a24group.com" ]; then
    echo "Commit made by ci user, no further actions"
else
    # Get the git branch that we are on
    GIT_BRANCH=$(git branch --show-current)
    echo "Branch identified as $GIT_BRANCH"

    # Generate the docs
    npm run dev-generate-event-docs

    # Check if the Events.md was changed
    REGENERATED=$( git status -s | grep "Events.md" )

    if [ -z "$REGENERATED" ]; then
        echo "Events.md had no changes" # No Changes
    else
        echo "Events.md changed, committing...." 

        echo "Setting git globals..."
        git config --global user.name "CI"
        git config --global user.email "devonly@a24group.com"
        echo "Adding files..."
        git add Events.md
        echo "Comitting..."
        git commit -m 'Update event documentation'
        echo "Pushing..."
        #git push git@github.com:A24Group/staffshift-agency-client-management.git $GIT_BRANCH
        echo "Pushed"
    fi
fi