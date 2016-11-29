```
using https module

Usage:

  cat file.csv | ./import [options] type 

Description:

  Create or update data from a CSV formatted file using the /api/v1 API,
  requires webapp version 2.6.2 or later.  Returns errors and is silent on
  success.

  You must specify the document type as a parameter.  Each type has its own
  contraints and required columns. 

    Currently supported types: 

      users
      people
      places-level-0
      places-level-1
      places-level-2
      places-level-3
      places-update

  The column names in your source data are mapped directly to property names on
  the JSON POST body or can be mapped to different strings with the `-c`
  option.  To understand more about the special meanings of property names see
  the project-templates or the medic-api documentation.

  Column names that begin with `place.` or `contact.` are handled
  specially.  This allows you to specify custom properties on the contact or
  place objects that are associated with the data.  For example if you define a
  column labeled `place.supervisor`, then the values in those cells are set
  on the `supervisor` property of the place object during user creation.

Options:

  -h  This help information

  -w  Wait between requests (ms).  Default 500

  -d  Dry run, only prints request body.

  -p  Set the `place` UUID value on the command line rather than in the input
      data. This can be convenient if all the rows in your data are associated
      with the same place.

  -c  Comma separated list of columns to import.  Also supports a colon
      separator to map the spreadsheet column name to the obj property
      name.  If not specified attempts to import all columns.

      Examples:
        
        Import only the 'uuid' and 'name' columns:

          -c uuid,name 

        Map the 'ID' column name to the 'uuid' property name on the object.

          -c ID:uuid,Village:contact_name

Environment Variables:

  COUCH_URL
  
    Specifies the URL of the project.

    Examples:

      export COUCH_URL=https://admin:secret@project.app.medicmobile.org

Usage Examples:

  Users import dry run:

    cat 'Group 2 Tula.csv' | ./import users -d

  Users import dry run with a place (district/branch) identifier:

    cat 'Group 2 Tula.csv' | \
      ./import users -d 8fe84af17cb7ac863a92e884e50440c3

  Users import:

    cat 'Group 2 Tula.csv' | \
      ./import users 8fe84af17cb7ac863a92e884e50440c3

  Use head command to only create first record:

    head -2 'Group 2 Tula.csv' | \
      ./import users 8fe84af17cb7ac863a92e884e50440c3

  Import people:

    cat 'Supervisors.csv' | \
      ./import people 8fe84af17cb7ac863a92e884e50440c3

  Import people and ignore the concession and gender columns:

    cat 'Supervisors.csv' | \
      ./import people -i concession,gender 8fe84af17cb7ac863a92e884e50440c3


```
