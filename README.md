# PowerBI-AngularJS
A demo AngularJS SPA accessing Power BI REST APIs

advantage: no backend to maintain

Register your app: https://dev.powerbi.com/apps

Create New Website using Templates > JavaScript > Blank Azure Node.js Web Application

File > Open > Web Site
Redirect URL from property page - http://localhost:22301/
Select Read All Dashboards/Reports/Groups
    -> Client ID 92f12926-5cf0-4460-83b6-14366bbaa88a
Enable implicit auth
    Go to https://manage.windowsazure.com/ > Active Directory > {Your Tenant} > Applications
    Search for app using Client ID or app name
    Manage Manifest > Download Manifest
    Look for 'oauth2AllowImplicitFlow' and set it to true
        availableToOtherTenants: false
    Manage Manifest > Upload Manifest

bower init
bower install <package> -save

Packages:
bower install requirejs -save
bower install angular -save
bower install angular-route -save
bower install requirejs-domready -save
bower install adal-angular -save
bower install bootstrap -save
bower install fontawesome -save
bower install require-css -save

TODO: list reason for each package
