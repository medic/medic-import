# Overview

Medic Import is a set of NodeJS tools to help you import your data into Medic
Mobile.  Importing is a two step process, first format and prepare your raw
data then import it.

The following command line tools are installed with this package:

 - [medic-export-mysql-query](docs/export-mysql-query.md)
 - [medic-format-csv](docs/format-csv.md)
 - [medic-import](docs/import.md)

# Getting Started

A new import project typically begins with a spreadsheet of raw data that you
want to import.  This might be an export from a database or maintained some
other way.

Create a directory for your project:

```
mkdir medic-projects-493
```

Create your package.json:

```
{
  "name": "medic-projects-493",
  "dependencies": {
    "medic-import": "latest"
  }
}
```

Install the dependencies:

```
npm install
```

# Project Templates

Medic Import is bundled with a set of project templates for common import
tasks.  This is a good starting point for your projects.  You can just copy and
modify these files in your working directory to get started.  Each project
template also includes a Makefile so after installing you can execute `make` to
run the example.

  - [Import users](project-templates/import-users)
  - [Import users with related data](project-templates/import-users-w-supervisors)
  - [Import contacts (places and people)](project-templates/import-contacts)

Example:

```
cp node_modules/medic-import/project-templates/import-users/* .
make
```

# Related Data

Related data should always be created first.

