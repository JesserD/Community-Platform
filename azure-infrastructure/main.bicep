param appName string
param appServicePlanName string
@secure()
param CloudName string
@secure()
param ApiKey string
@secure()
param ApiSecret string
@secure()
param tokenKey string

@description('The location that the resources should be created in.')
param location string = resourceGroup().location

module app 'modules/app.bicep' = {
  name: 'app'
  params: {
    location: location
    appName: appName
    appServicePlanName: appServicePlanName
    cloudinary: { CloudName: CloudName, ApiKey: ApiKey, ApiSecret: ApiSecret }
    tokenKey: tokenKey
  }
}
