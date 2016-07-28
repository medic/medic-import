# format-csv Configuration

If you run `./format-csv` or `node format-csv` and there is no default
configuration file `format-csv-config.js` it will print the usage message.  The
configuration file exports an object with a `columns` property that defines how
`format-csv` should process and format the input data, for an example see the
Examples section.

Each key in the `columns` object represents the new column name in the output.
The following types are supported:

See `examples/` for configuration examples that you can run. There are also
Makefiles provided so you can change to the directory and run `make` to run the
formatter.

To run the examples you will need the following dependencies:

```
npm install fast-csv uuid password-generator
```

## String

If the value is a string then that string will be used to match a column in the
source data. No formatting is done, the raw value for that column is used.

## Function

The function is called using the cell value and the context of the function is
set to the newly transformed object.

## Object

An object allows for more complex processing/formatting. The following
options are supported:

### `use`

The source column name to use.

### `format`

A reference to a function or an array with a reference to a function and the
options to pass to that function. Similar to `format` the function is also
called with a special context.

### `optional`

The column value is optional, by default all column values are required.

### `unique`

Warns you if values within a column are not unique.

# Examples 

## Generate New Users

I have a list of users I want to create accounts for.  Generate username,
passwords and unique identifiers for their contact and place objects.

### Source

File: examples/users/users.csv

```
Num,ChpCode,Surname,Chp_Phone,Android Version
1,ZSG003,Betyy Bigombe,0782189968,4.4
2,ZSG004,Beatrice Wabudeya,0731200398,4.4
3,ZSG005,Christine Kitumba,0742231269,4.2
```

### Format

```
cat docs/examples/users/users.csv | \
  ./format-csv -c docs/examples/users/format-csv-config.js > new-users.csv
```

### Output

```
name,phone,external_id,username,password,contact.uuid,place.uuid
Bigombe Betyy,+256782189968,ZSG003,bigombebe,fukunuhuzo,89999ddb-a213-4ae6-81e9-cdd02c5d435c,d92d7271-39d6-4918-be38-29d106fed152
Wabudeya Beatrice,+256731200398,ZSG004,wabudeyabe,dihojigere,f85019fe-d44b-42da-adf3-6f97e7c12bbc,93e3ab7c-4a09-4471-82c8-3d065f46f37d
Kitumba Christine,+256742231269,ZSG005,kitumbach,nifaxociba,b6bc0286-349c-4c69-8e6d-873343949d46,57dff3fe-d2c0-48fd-9186-dc795127a2e7
```

### Config

File: examples/users/format-csv-config.js

```
var password = require('password-generator'),
    uuid = require('uuid');

var normalize = require('../../../lib/normalize');

module.exports = {
  columns: {
    name: {
      use: 'Surname',
      format: [normalize.name, {reverse: true}]
    },
    phone: {
      use: 'Chp_Phone',
      format: [normalize.phone, '+256']
    },
    external_id: 'ChpCode',
    username: {
      format: function() {
        return normalize.username(this.name);
      },
      unique: true
    },
    password: password,
    "contact.uuid": uuid,
    "place.uuid": uuid
  }
};
```

## Generate New Users With Related Data

I have a list of new users with supervisors I want to import and relate the
supervisor to the user using a specific field on the user's contact object.

First generate supervisor objects with unique identifiers. Export your list of
supervisors from your spreadsheet and pipe though the formatter.

### Source

File: examples/users-w-supervisors/supervisors.csv

```
Supervisor
Sandy
Renee
Peter
```

### Format

```
cat docs/examples/users-w-supervisors/supervisors.csv | \
  ./format-csv -c ./docs/examples/users-w-supervisors/supervisors-config.js
```

### Output

```
name,uuid
Sandy,515b3483-e418-4eaf-b75c-34790d2e7249
Renee,0b67b4c5-84a6-4a93-b66a-e2a74424b627
Peter,c56dd1f3-6d97-4e83-8bb4-35361913e63a
```

### Config

File: examples/users-w-supervisors/supervisors-config.js

```
var uuid = require('uuid');

var supervisorsConfig = {
  columns: {
    name: {
      use: 'Supervisor',
      unique: true
    },
    uuid: uuid
  }
};

module.exports = supervisorsConfig;
```

Now we have a list of supervisors with IDs and we can relate them to the users
with a key like Name. Ideally we'd use something guaranteed to be unique like a
supervisor_id but if you don't have that then use or create something that is
unique. In this example we use the supervisor's name.

### Source

File: examples/users-w-supervisors/users.csv

```
Num,ChpCode,Supervisor,Surname,Chp_Phone,Android Version
1,ZSG003,Peter,Betyy Bigombe,0782189968,4.4
2,ZSG004,Renee,Beatrice Wabudeya,0731200398,4.4
3,ZSG005,Sandy,Christine Kitumba,0742231269,4.2
2,ZSG006,Renee,Florence Kambogo,0774992131,4.4
```

### Format

```
cat docs/examples/users-w-supervisors/users.csv | \
  ./format-csv -c docs/examples/users-w-supervisors/users-config.js
```

### Output

```
name,phone,external_id,supervisor,username,password,contact.uuid,place.uuid,place.supervisor
Bigombe Betyy,+256782189968,ZSG003,Peter,bigombebe,yewamadeqo,7c75cedf-180d-4457-a077-05078820cc1b,09abdb3f-fcd9-4cee-bcd7-273f2f62106d,c56dd1f3-6d97-4e83-8bb4-35361913e63a
Wabudeya Beatrice,+256731200398,ZSG004,Renee,wabudeyabe,tucujataso,4089472d-566e-443b-b5f6-a464e7273f1e,243b503c-c07b-4db9-b6f9-49372b5bb046,0b67b4c5-84a6-4a93-b66a-e2a74424b627
Kitumba Christine,+256742231269,ZSG005,Sandy,kitumbach,rororixudi,32c7c9a6-4d84-42ef-b10b-44dfe287ca44,ab3d414d-ac25-4752-9542-961f39aa9304,515b3483-e418-4eaf-b75c-34790d2e7249
Kambogo Florence,+256774992131,ZSG006,Renee,kambogofl,jucetuxire,7e197094-ad79-458b-ae14-b4ce26855b5f,649f20a3-9d3a-48c5-bec3-0e197b4df146,0b67b4c5-84a6-4a93-b66a-e2a74424b627
```

Notice in the output the `place.supervisor` column reflects the generated
supervisor ID.  This happens because of the `related` portion of the
configuration we reference the `new-supervisors.csv` file we generated in the
first step. This function finds and indexes the related data so the rest of the
configuration can access it. 


### Config

File: examples/users-w-supervisors/users-config.js

```
var password = require('password-generator'),
    csv = require('fast-csv'),
    uuid = require('uuid'),
    path = require('path');

var normalize = require('../../../lib/normalize'),
    relatedData,
    config;

var usersConfigWithSupervisors = {
  columns: {
    name: {
      use: 'Surname',
      format: [normalize.name, {reverse: true}]
    },
    phone: {
      use: 'Chp_Phone',
      format: [normalize.phone, '+256']
    },
    external_id: 'ChpCode',
    supervisor: {
      use: 'Supervisor',
      optional: true
    },
    username: {
      format: function() {
        return normalize.username(this.name);
      },
      unique: true
    },
    password: password,
    "contact.uuid": uuid,
    "place.uuid": uuid,
    "place.supervisor": function() {
      var key = this.supervisor.trim();
      if (!key) return;
      if (!relatedData[key]) {
        console.error(this);
        throw new Error('Supervisor key not found: ' + key);
      }
      return relatedData[key];
    }
  },
  related: {
    load: function(callback) {
      var file = [__dirname, 'new-supervisors.csv'].join(path.sep);
      if (!relatedData) {
        relatedData = {};
      }
      csv
        .fromPath(file, {headers:true})
        .on("data", function(obj) {
          relatedData[obj.name] = obj.uuid;
        })
        .on("end", function() {
          callback();
        });
    }
  }
};

config = usersConfigWithSupervisors;

module.exports = function(callback) {
  if (config.related && config.related.load) {
    config.related.load(function(err) {
      if (err) {
        return console.error(err);
      }
      callback(null, config);
    });
  } else {
    callback(null, config);
  }
};
```
