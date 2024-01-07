# PsiProject

*Developed by André Carvalho and Diogo Veigas as part of Programming and Integration of Services.*

## Overview
This comprehensive project comprises the following components:

- **API**
- **Web App**
- **Database**
- **2 Instruction Manuals**

## Quick Start
To expedite the setup process, ensure Node.js is installed, and follow these steps:

```bash
npm install
npm start
```

### Quick Start
For debuggin purposes, the following command might suit you best:
```bash
npm run dev
```

## Database
The data base used in this project is MySQL, because of that, you must have MySQl Workbench or any other way of running MySQL scripts and run the ```db.sql``` file.

### Seed the database
In order to seed your database with the most updated data from the provider API, the following route does the job:
```bash
http://localhost:8081/api/seed/all?force=true
```

## Project Status
*Currently under active development.*