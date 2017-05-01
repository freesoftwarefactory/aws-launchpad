This files compounds the static part of the website, hosted in s3.

## How to Sync

	cd files;
	aws s3 sync . --region us-east-2 s3://pwh-site 
	cd .. ;
