```

Usage: export-mysql-query file

Description:

  Query a MySQL database and stream results to stdout in csv format.
  Normalizes date fields as GMT strings.

Enviornment Variables:

  MYSQL_URL

Dependencies:

  This script is rarely used so mysql dependency is handled manually:

    npm install mysql
 
Examples:

  MYSQL_URL=mysql://root@localhost:3306/mydb ./export-mysql-query query.sql \
    > data/families.csv

```
