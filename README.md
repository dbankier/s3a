# S3A

A (currently) simple S3 Log Analyser.

This was thrown together pretty quickly to serve some basic needs, but I hope to extends this with more useful features.

## Prerequisites

Use something like [rclone](https://github.com/ncw/rclone) to sync your s3 logs to a local directory.

## Install

```
npm install s3a --save
```

## Usage

Read the help

$ s3a --help

![help](https://raw.githubusercontent.com/dbankier/s3a/master/img/help.png)

Possible rollup keys include, `userId`, `bucket`, `time`, `remoteIP`, `requester`, `requesterID`, `operation`, `key`, `requestURI`, `status`, `errorCode`, `bytesSent`, `objectSize`, `totalTime`, `turnAroundTime`, `referer`, `userAgent`, `versionID`

Smarter roll up keys will be added eventually, e.g. `country`, `state`, etc.

## Example

![example](https://raw.githubusercontent.com/dbankier/s3a/master/img/example.png)


## Licence

MIT
