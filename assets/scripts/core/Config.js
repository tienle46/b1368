/**
 * Created by Thanh on 9/1/2016.
 */

var app = require('app');

app.config = {};
app.config.host = "123.31.12.100";
app.config.port = 8481;
// app.config.host = "123.30.238.174";
// app.config.port = 8921;
app.config.zone = "XGame";
app.config.debug = false;
app.config.useSSL = false;
app.config.test = true;
app.config.testIngame = false;
app.config.defaultLocale = 'vi';
app.config.poorNetworkThreshold = 2000;
app.config.pingPongPollQueueSize = 3;
app.config.pingPongInterval = 60000;
app.config.buildForMobile = true; // if ( sys.platform !== 'browser')
app.config.app_secret_key = '63d9ccc8-9ce1-4165-80c8-b15eb84a780a';

app.config.fbAppId = 226720277782952;
app.config.fbxfbml = true;
app.config.fbVersion = 'v2.8';
app.config.fbScope = 'public_profile,email';

app.config.fanpage = `https://www.messenger.com/t/${app.config.fbAppId}`;
app.config.supportHotline = '0983.369.898';