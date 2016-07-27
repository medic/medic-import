```

Usage:

  cat file.csv | ./import [options] [place uuid]

Description:

  Create data against the /api/v1 API, requires webapp version 2.6.2 or later.
  Returns errors and is silent on success.
  
  This script supports multiple record types and you must specify what type
  with the -t flag.  Each type has it's own set of contraints and required
  columns.

  Users require the following column names:

    name,username,password[,phone,external_id,place.parent]
    
  People require the following column names:

    name[,uuid,place]

  Columns in brackets at the end are optional.  Parent places (i.e. Districts
  or Branches) can be included as an argument to the command or specified in
  the column labeled `place.parent`.

  Column names that begin with `place.` or `contact.` are handled
  specially.  This allows you to specify custom properties on the contact or
  place objects that are associated with the user.  For example if you define a
  column labeled `place.supervisor`, then the values in those cells are set
  on the `supervisor` property of the place object during user creation.

Options:

  -t  Record type. Currently supported types: users, people
  -d  Dry run, only prints request body.
  -h  This help information

Environment Variables:

  COUCH_URL

Dependencies:

  npm install fast-csv

Examples:

  Users import dry run:

    cat "Group 2 Tula.csv" | \
      COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
      ./import -t users -d

  Users import dry run with a district/branch identifier:

    cat "Group 2 Tula.csv" | \
      COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
      ./import -t users -d 8fe84af17cb7ac863a92e884e50440c3

  Users import:

    cat "Group 2 Tula.csv" | \
      COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
      ./import -t users 8fe84af17cb7ac863a92e884e50440c3

  Use head command to only create first record:

    head -2 "Group 2 Tula.csv" | \
      COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
      ./import -t users 8fe84af17cb7ac863a92e884e50440c3

  Import people:

    cat "Supervisors.csv" | \
      COUCH_URL=https://admin:secret@myproject.app.medicmobile.org \
      ./import -t people 8fe84af17cb7ac863a92e884e50440c3


```
