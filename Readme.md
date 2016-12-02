# Overview

Medic Bulk Utils is a set of command line tools and [documentation](./docs/) to
help manage large amounts of Medic Mobile data.

The following command line tools are installed with this package:

 - [medic-stats](docs/stats)
 - [medic-import](docs/import)
 - [medic-format-csv](docs/format-csv)
 - [medic-csv-to-json](docs/csv-to-json)
 - [medic-update-embedded](docs/update-embedded)
 - [medic-extend-properties](docs/update-properties)
 - [medic-collect-user-data](docs/collect-user-data)
 - [medic-export-mysql-query](docs/export-mysql-query)

# Getting Started

A new project typically begins with a spreadsheet of raw data that you want to
update or add (import).  This might be an export from a database or maintained
some other way.

Create a directory for your project:

```
mkdir medic-projects-493
```

Create your package.json:

```
{
  "name": "medic-projects-493",
  "dependencies": {
    "medic-bulk-utils": "latest"
  }
}
```

Install the dependencies:

```
npm install
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

Example:

```
cp node_modules/medic-import/project-templates/import-users/* .
make
```

