### Everymanbaby
Like the cinema but have a small baby that screams all the time? Too lazy to go to the Everyman's website and click a few links to find out when the next Baby Club showing is? This handy Lambda uses the undocumented Everyman API to find the next week's showing and send an SNS notification every Wednesday.

Deployed with Serverless framework because I couldn't be bothered to use the native https library and Serverless handles packaging the dependencies. Don't think you can subscribe to SNS topics as part of the sls deployment, so the topic and subscription is created manually in AWS. This also only works currently with the Birmingham Everyman. You could do it for any of their cinemas by finding the cinema location ID (Birmingham's is 13).