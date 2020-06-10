# GitHub Bot

[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)](https://wildfirepy-bot.herokuapp.com/)

This bot was originally made for [The WildfirePy Project](https://github.com/wildfirepy)

### Features:

- Welcome user on opening issues

  - Optionally, can assign the issue to the person

- Welcome user on opening PRs
- Assign PR to people based on files changed
- Assure changelog is added in a PR
  - Can omit changelog check by adding a label to PR

### Configuration:

Add a `bot.yml` file under the `.github` folder in the default branch of your repository.

```yaml
issue:
  # Message to be displayed. `{ ACTOR }` will be replaced by the ID of the person who opened this issue. Similarly `{ NUMBER }` will be replaced by the issue number
  message: "Thank you { ACTOR } for opening this issue."
  # Should Issues be assigned automatically
  assign: true
pr:
  # ThankYou message. `{ NUMBER }` will be replaced by PR number and `{ ACTOR }` will be replaced by ID of person opening PR
  message: "Thanks for opening PR #{ NUMBER }"
  # Should PRs be assigned automatically
  assign: true
  # Conditions based on which PRs are assigned
  conditions:
    # Glob for matching files
    - glob: "net/**"
      # IDs of people to assign to
      assignes:
        - Michael
        - John123
    - glob: "src/lib/*.c"
      assignes:
        - superuser
  # Should changelog be checked
  change_check: true
  # Glob of file/files that should be updated
  # Can use `{ NUMBER }` and `{ ACTOR }` which
  # will be replaced with suitable values
  change_glob: "Changelog.md"
  # Skip Changelog Label
  skip_changelog_label: "Skip Changelog"
```
