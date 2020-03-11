# Eradani Connect Server

This is the REST server over Aldon LMi used by the Eradani Connect Jira plugin.

## Install and configure XMLSERVICE

## Configure Eradani Connect Server

This is a list of steps that need to be completed in order to get the Eradani Connect Server configured and up and running after cloning the git repository.

> Note: in this guide I cloned the *Eradani Connect Server* repo to the `/home/demo/eradani-connect-server` directory. In the Beta/GA version this should probably be put in something like `/QOpenSys/Eradani/Eradani-Connect/ProdData`.

### Create configuration file

Make a copy of the file `config/development.json.sample` and name it `config/development.json`. This file is available at `/home/staging/eradani-connect-server/config` for the staging server and `/home/demo/eradani-connect-server/config` for the demo (production) server.

- Set app.port to an available port
- Set the xml.* options to match those of the XMLSERVICE instance you will be using
- Set the logger.maxLoggingLevel option to your desired level of logging. Available levels are listed below in order of increasing severity. Once you set a logging level, **all levels below it in this list will also be enabled!** For example, if you set the logging level to _"info"_, the server will also store _"warn"_ and _"error"_ level logs, but not _"verbose"_, _"debug"_, or _"silly"_ level logs.
    - "silly"
    - "debug"
    - "verbose"
    - "info"
    - "warn"
    - "error"

After setting the values copy `config/development.json` to `config/production.json`.

### Create JWT keys

Run the following commands from a PASE shell to create the JWT keys and rename the public key with the name the server expects:

```sh
$ ssh-keygen -f config/keys/jwt-private.key
$ mv config/keys/jwt-private.key.pub config/keys/jwt-public.key
```

### Create the logs directory

Run the following the command to create the directory for the log files:

```sh
$ mkdir logs
```

### Create the native IBM i objects

Create the necessary native objects so that the server can be administered from the native environment.

#### Create user profile

Create a user profile for Eradani Connect. All objects will be owned by this user and the server will run as this user. 

```
CRTUSRPRF USRPRF(ECNCT) PWDEXP(*YES) INLPGM(QSYS/QCMD) TEXT('Eradani Connect user profile') JOBD(QGPL/QDFTJOBD) MSGQ(QUSRSYS/ECNCT)
```

#### Create libraries

Create the program and data libraries.

```
CRTLIB LIB(ECNCT) TEXT('Eradani Connect program data')

CHGOBJOWN OBJ(ECNCT) OBJTYPE(*LIB) NEWOWN(ECNCT)

CRTLIB LIB(ECNCTUSR) TEXT('Eradani Connect user data')

CHGOBJOWN OBJ(ECNCTUSR) OBJTYPE(*LIB) NEWOWN(ECNCT)
```

#### Create the routing class and job queue

```
CRTCLS CLS(ECNCT/ECNCT) TEXT('Class for Eradani Connect subsystem')

CRTJOBQ JOBQ(ECNCT/ECNCT) TEXT('Job queue for Eradani Connect jobs')
```

#### Create the job and subsystem descriptions 

```
CRTJOBD JOBD(ECNCT/ECNCT) JOBQ(ECNCT/ECNCT) TEXT('Eradani Connect job description') USER(ECNCT) PRTTXT('Eradani Connect jobs') RQSDTA('call PGM(QP2SHELL) PARM(''/home/demo/eradani-connect-server/ecnct.sh'')')

CRTSBSD SBSD(ECNCT/ECNCT) POOLS((1 *BASE)) MAXJOBS(30) TEXT('Eradani Connect subsystem description')
```

#### Add objects to subsystem

Add the job queue and class to the subsystem description. Also add the job description as an auto-start entry to the subsystem.

```
ADDJOBQE SBSD(ECNCT/ECNCT) JOBQ(ECNCT/ECNCT) MAXACT(15)

ADDRTGE SBSD(ECNCT/ECNCT) SEQNBR(9999) CMPVAL(*ANY) PGM(QSYS/QCMD) CLS(ECNCT/ECNCT)

ADDAJE SBSD(ECNCT/ECNCT) JOB(ECNCT) JOBD(ECNCT/ECNCT)
```

#### Change application's owner

Change the owner of the Eradani Connect server application:

```
CHGOWN OBJ('/home/demo/eradani-connect-server/') NEWOWN(ECNCT) SUBTREE(*ALL)
```

## Updating the Eradani Connect server

Stop the server:

```
ENDSBS SBS(ECNCTS) /* Staging */
/*  or  */
ENDSBS SBS(ECNCT)  /* Demo    */
```

Update the code:

```sh
# Staging
cd /home/staging/eradani-connect-server/  
#
# Or
#
# Demo
cd /home/demo/eradani-connect-server/

# Update the repo
git pull
```

> Note: Check for configuration updates in ./src/config/development.sample.json.

Start the server:

```
STRSBS SBSD(ECNCTS/ECNCTS) /* Staging */
/*  or    */
STRSBS SBSD(ECNCTS/ECNCT)  /* Demo    */
```


