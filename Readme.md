Overview
========

The import process is divided into two major parts: formating data and importing data.

Typically the raw data to import is provided by the partner organization in a
common spreadsheet format like CSV.  It's also likely to be imported in parts
or groups, it's best to request a portion of the import data to test with
beforehand.

If by chance you do need to introspect a MySQL database we have a script that
outputs CSV for use in the formatting step.  See `./export-mysql-query` and
[docs/export-mysql-query.md](docs/export-mysql-query.md) for more info. 


Formatting Data
================

See `./format-csv` output, [docs/format-csv.md](docs/format-csv.md) and
[docs/format-csv-config.md](docs/format-csv-config.md) for more info. 

Use this script to normalize your data and preserve or format any fields that
are important, like external ID, or group ID.

Formatting also helps in defining UUIDs for every document you plan to create.
Pregenerating identifers for every document you create in the database is
necessary because it not only allows you to track and check the data after it
was imported but also allows you to re-run the import in case of failures
without creating duplicates.  

When creating a new user a place (typically a District UUID) needs to be
provided using one of two methods otherwise you will recieve an error from the
API like `status code 400`.  Specify the place ID as a column in the
spreadsheet or provide it as an argument to the import script.

After formatting user data you might end up with columns below.  In this case
the username column is used as the identifier:

    name,phone,username,password,district,external_id

Before import the data should also be consistent.  Name should be ordered
either last name first or first name last, whichever one it should be
consistent in the source data, the format script doesn't handle that.  This is
meaninful because usernames are typically generated using the last name and
first letter of the first name.

Do quick scan to make sure the data looks right then proceed to the next step.

Importing Data
===============

See `./import -h` and [docs/import.md](docs/import.md) for more info. 

Once the import process if finished you can share the data files with people for
acceptance testing.  Since the files contain usernames and passwords you should
post them in Slack, not Github.


Testing
=======

New Users
----------

  1. Navigate to myproject.app.medicmobile.org and login with a new user
  2. Open Chrome developer tools so that you can see Network tab and the console
  3. When the Targets tab appears, click Menu then About to get to the About page.
  4. Wait until you see the Initial Sync Failed
  5. Click Menu and then History to go to the History tab.
  6. Wait a while (10-15 mins) until you see the + (plus) sign illuminate.
     This should correspond with a console message that says `Replicate from
     hitting pause after X.XXX seconds`

Once we have a better solution for initial replication, we can reduce that
10-15 mins to something smaller.

Notes
=====

Performance
------------

We found that importing lots of data can slow down syncing and loading of
phones, so until we have solutions follow a few rules of thumb:

  - Create users then bump the rev of a form. This should happen as soon as
    possible.

  - Set up the phones as soon as possible. Initial sync from medic to be done
    on no more than 4 phones at a time. Phones should be syncing old app data
    at the same time. It may take a day or two to complete the initial sync.

  - Once the initial sync is complete on all phones, run the data/record
    migration (significantly more docs than just the user account data) then
    bump the rev of a form again.

