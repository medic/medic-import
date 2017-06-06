# Overview

Medic Bulk Utils is a set of command line tools and [documentation](./docs/) to
help manage large amounts of Medic Mobile data.

The following command line tools are installed with this package:

 - [medic-stats](docs/stats.md)
 - [medic-import](docs/import.md)
 - [medic-format-csv](docs/format-csv.md)
 - [medic-csv-to-json](docs/csv-to-json.md)
 - [medic-update-embedded](docs/update-embedded.md)
 - [medic-extend-properties](docs/extend-properties.md)
 - [medic-export-mysql-query](docs/export-mysql-query.md)

# Getting Started

A new project typically begins with a spreadsheet of raw data that you want to
update or add (import).  This might be an export from a database or maintained
some other way.

Create a directory for your project, name it whatever you want:

```
mkdir medic-projects-493 && \
cd medic-projects-493
```

Create your package.json (using -y to accept defaults):

```
npm init -y
```

Install this dependency:

```
npm install --save medic-bulk-utils
```

# Project Templates

This repo is bundled with a set of project templates for common tasks.  This is
a good starting point for your projects.  You can just copy and modify these
files in your working directory to get started.  Each project template also
includes a Makefile so after installing you can execute `make` to run the
example.

  - [Import users](project-templates/import-users)
  - [Import users with related data](project-templates/import-users-w-supervisors)
  - [Import contacts (places and people)](project-templates/import-contacts)
  - [Import records](project-templates/import-records)
  - [Migrations](project-templates/migrations)

Example:

```
cp -i node_modules/medic-bulk-utils/project-templates/import-users/* .
make
```

Then read the instructions:

```
cat Readme
```


