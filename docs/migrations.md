```

Usage: migrations [command]

Description:
  
  Management interface for database migrations.

Commands:
  
  help  Print this information.

  run <path>
  
    Run or execute a migration package.  Requires a `path` parameter to
    the migration package.
        
    Basic steps of running a migration are:

      1) Install a ddoc and view on a database
      2) Backup the view data including docs
      3) Execute and save results from a script that updates the data
      4) Test to make sure view is empty, this means bad data was fixed
      5) Delete the migration ddoc
         
Environment Variables:

  COUCH_URL   The server URL to run against.
  TMPDIR      The directory to store results and backups in. Default is
              '$TMPDIR/medic-migrations'.
  DEBUG       Set to true for verbose output.

Examples:
 
  COUCH_URL=http://admin:secret@localhost:5984 \
  migrations run ./resolve-contacts-on-data-records

```
