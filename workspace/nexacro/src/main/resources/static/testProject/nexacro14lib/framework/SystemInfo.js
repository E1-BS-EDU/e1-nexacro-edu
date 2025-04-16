//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2014 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro-public-license-readme-1.1.html	
//
//==============================================================================

if (!this.nexacro) {
	this.nexacro = {
	};
}


nexacro.OS = "";
nexacro.OSVersion = "";
nexacro.DEVICE = "";
nexacro.SystemType = "";
nexacro.BrowserLang = "";
nexacro.Browser = "";
nexacro.BrowserVersion = -1;
nexacro.BrowserType = "";
nexacro._is_ua_freeze = false;
nexacro._is_ua_loading = false;
if (navigator && navigator.userAgentData) {
	nexacro._is_ua_freeze = true;
	nexacro._findUAInfo = function (arr, callbackFn) {
		for (var i = 0, len = arr.length; i < len; ++i) {
			if (callbackFn(arr[i], i)) {
				return arr[i];
			}
		}
		return null;
	};

	nexacro._getUserAgentString = function (agent) {
		var userAgent = agent;
		if (typeof userAgent === "undefined") {
			if (typeof navigator === "undefined" || !navigator) {
				return "";
			}
			userAgent = navigator.userAgent || "";
		}
		return userAgent.toLowerCase();
	};

	nexacro._execRegExp = function (pattern, text) {
		try {
			return new RegExp(pattern, "g").exec(text);
		}
		catch (e) {
			return null;
		}
	};

	nexacro._hasUserAgentData = function () {
		if (typeof navigator === "undefined" || !navigator || !navigator.userAgentData) {
			return false;
		}

		var brands = navigator.userAgentData.brands || navigator.userAgentData.uaList;

		return !!(brands && brands.length);
	};

	nexacro._findVersion = function (versionTest, userAgent) {
		var result = nexacro._execRegExp("(" + versionTest + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", userAgent);
		return result ? result[3] : "";
	};

	nexacro._findPreset = function (presets, userAgent) {
		var userPreset = null;
		var version = "-1";
		nexacro._findUAInfo(presets, function (preset) {
			var result = nexacro._execRegExp("(" + preset.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", userAgent);

			if (!result || preset.brand) {
				return false;
			}

			userPreset = preset;
			version = result[3] || "-1";

			if (preset.versionAlias) {
				version = preset.versionAlias;
			}
			else if (preset.versionTest) {
				version = nexacro._findVersion(preset.versionTest.toLowerCase(), userAgent) || version;
			}

			version = version.replace(/_/g, ".");
			return true;
		});

		return {
			preset : userPreset, 
			version : version
		};
	};

	nexacro._findPresetBrand = function (presets, brands) {
		var brandInfo = {
			brand : "", 
			version : "-1"
		};

		nexacro._findUAInfo(presets, function (preset) {
			var result = nexacro._findBrand(brands, preset);

			if (!result) {
				return false;
			}

			brandInfo.brand = preset.id;
			brandInfo.version = preset.versionAlias || result.version;
			return brandInfo.version !== "-1";
		});

		return brandInfo;
	};

	nexacro._findBrand = function (brands, preset) {
		return nexacro._findUAInfo(brands, function (_a) {
			return nexacro._execRegExp("" + preset.test, _a.brand.toLowerCase());
		});
	};

	nexacro.BROWSER_PRESETS = [{
		test : "edgios|edg|microsoft edge", 
		id : "edgewebkit", 
		versionTest : "edg"
	}, {
		test : "edge", 
		id : "edge", 
		versionTest : "edge"
	}, {
		test : "msie|trident|windows phone", 
		id : "IE", 
		versionTest : "iemobile|msie|rv"
	}, {
		test : "opera|opr", 
		id : "Opera", 
		versionTest : "opr|version"
	}, {
		test : "chrome|crios", 
		id : "Chrome", 
		versionTest : "chrome|crios"
	}, {
		test : "Webkit", 
		id : "WebKit", 
		versionTest : "WebKit"
	}, {
		test : "android", 
		id : "android browser", 
		versionTest : "version"
	}, {
		test : "safari|iphone|ipad|ipod", 
		id : "Safari", 
		versionTest : "version"
	}, {
		test : "mobilesafari", 
		id : "MobileSafari", 
		versionTest : "mobilesafari"
	}, {
		test : "gecko", 
		id : "Gecko", 
		versionTest : "rv"
	}];

	nexacro.BROWSER_EXTRA_PRESETS = [{
		test : "samsungbrowser", 
		id : "SamsungBrowser"
	}, {
		test : "XiaoMi", 
		id : "MiuiBrowser"
	}, {
		test : "Samsung", 
		id : "samsung internet", 
		versionTest : "version"
	}, {
		test : "NAVER", 
		id : "NaverBrowser"
	}];

	nexacro.BROWSER_IE_PRESETS = [{
		test : "Trident\/7.0", 
		id : "IE11"
	}, {
		test : "Trident\/6.0", 
		id : "IE10"
	}];

	nexacro.WEBKIT_PRESETS = [{
		test : "applewebkit", 
		id : "webkit", 
		versionTest : "applewebkit|safari"
	}];

	nexacro.WEBVIEW_PRESETS = [{
		test : "(?=(iphone|ipad))(?!(.*version))", 
		id : "webview"
	}, {
		test : "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))", 
		id : "webview"
	}, {
		test : "webview", 
		id : "webview"
	}];

	nexacro.OS_PRESETS = [{
		test : "windows phone", 
		id : "Windows Phone", 
		type : "Win32"
	}, {
		test : "windows nt", 
		id : "Windows", 
		type : "Win32"
	}, {
		test : "win32|windows", 
		id : "Windows", 
		type : "Win32"
	}, {
		test : "iphone", 
		id : "iOS", 
		type : "iphone", 
		versionTest : "iphone os|cpu os"
	}, {
		test : "ipad", 
		id : "iOS", 
		type : "ipad", 
		versionTest : "iphone os|cpu os"
	}, {
		test : "macos|macintel|mac os x", 
		id : "Mac OS", 
		type : "mac"
	}, {
		test : "android|linux armv81", 
		id : "Android", 
		type : "android"
	}, {
		test : "Linux", 
		id : "Linux", 
		type : "linux"
	}];

	nexacro._isWebView = function (userAgent) {
		return !!nexacro._findPreset(nexacro.WEBVIEW_PRESETS, userAgent).preset;
	};

	nexacro._initNexacroPlatform = function () {
		if (nexacro.OS == "Mac OS") {
			if (navigator.userAgentData && navigator.userAgentData.mobile) {
				nexacro.OS = "iOS";
				nexacro.SystemType = "iPad";
				nexacro.SystemTypeEx = "ProforMouseEvent";
				nexacro.MobileDesktopMode = true;
			}
			else {
				nexacro.OS = "Mac OS";
			}
		}
		else if (nexacro.OS == "iOS") {
			if (nexacro.OSVersion >= "13.4") {
				nexacro.SystemTypeEx = "ProforMouseEvent";
			}
		}
		else if (nexacro.OS == "Linux") {
			if (("ontouchstart" in window) && (window.navigator.maxTouchPoints > 0)) {
				nexacro._AndroidDesktopMode = true;
			}
		}

		if (nexacro.Browser == "Safari" && nexacro._isMobile()) {
			nexacro.Browser = "MobileSafari";
		}

		nexacro.isTouchInteraction = (nexacro.Browser == "MobileSafari" || nexacro.OS == "Android" || nexacro.OS == "iOS" || nexacro.OS == "Windows Phone");

		nexacro._initBrowserValueset();
		nexacro._setStringInitHTML();
		nexacro._makeManagerFrameSrc();
		nexacro._makeManagerPopupFrameSrc();
	};

	nexacro._getLegacyAgent = function (userAgent) {
		var nextAgent = nexacro._getUserAgentString(userAgent);
		var isMobile = !!/mobi/g.exec(nextAgent);

		var _a = nexacro._findPreset(nexacro.BROWSER_PRESETS, nextAgent), browserPreset = _a.preset, browserVersion = _a.version;

		var _b = nexacro._findPreset(nexacro.OS_PRESETS, nextAgent), osPreset = _b.preset, osVersion = _b.version;

		nexacro.OS = osPreset ? osPreset.id : "unknown";
		nexacro.OSVersion = osPreset ? osVersion : "-1";

		nexacro.SystemType = osPreset ? osPreset.type : "";

		nexacro.Browser = browserPreset ? browserPreset.id == "edgewebkit" ? "edge" : browserPreset.id : "";
		nexacro.BrowserVersion = browserPreset ? parseInt(browserVersion) : 0;
		nexacro.BrowserMajorVersion = parseInt(browserVersion, 10);

		if (nexacro.Browser == "Edge") {
			nexacro.BrowserType = "Edge";
		}
		else if (nexacro._Browser == "Gecko") {
			nexacro.BrowserType = "Gecko";
		}
		else if (nexacro._Browser == "Opera") {
			nexacro.BrowserType = "Opera";
		}
		else {
			nexacro.BrowserType = "Webkit";
		}

		if (nexacro.Browser == "Safari" && isMobile) {
			nexacro.Browser = "MobileSafari";
		}

		if (nexacro.Browser == "Chrome") {
			var _extra = nexacro._findPreset(nexacro.BROWSER_EXTRA_PRESETS, nextAgent);
			if (_extra.preset) {
				nexacro.BrowserExtra = _extra.preset.id;
			}
		}

		if (nexacro._execRegExp("(MSIE)((?:\\/|\\s|:)([0-9|\\.|_]+))?", navigator.appVersion) || nexacro._Browser == "IE") {
			if (document.documentMode) {
				nexacro.BrowserVersion = parseInt(document.documentMode);
				var _ie = nexacro._findPreset(nexacro.BROWSER_IE_PRESETS, nextAgent);
				nexacro.BrowserType = _ie.preset ? _ie.preset.id : nexacro._Browser + nexacro._BrowserVersion;
			}
		}
	};

	nexacro._getClientHintsAgent = function (osData) {
		var userAgentData = navigator.userAgentData;
		var brands = (userAgentData.uaList || userAgentData.brands).slice();
		var fullVersionList = osData && osData.fullVersionList;
		var platform = (osData && osData.platform || userAgentData.platform || navigator.platform).toLowerCase();
		var _osversion = "-1", _browser = brands[0].brand, _browserversion = brands[0].version;

		var webkitBrand = nexacro._findPresetBrand(nexacro.WEBKIT_PRESETS, brands);
		_webkit = !!webkitBrand.brand;

		var platfomResult = nexacro._findUAInfo(nexacro.OS_PRESETS, function (preset) {
			return new RegExp("" + preset.test, "g").exec(platform);
		});

		nexacro.OS = platfomResult ? platfomResult.id : "";
		nexacro.SystemType = (platfomResult && platfomResult.type) ? platfomResult.type.toLowerCase() : "";

		if (osData) {
			_osversion = osData.platformVersion;
		}
		if (nexacro.OS == "Windows") {
			nexacro.OSVersion = _osversion.substr(0, _osversion.indexOf(".") + 2);
			if (parseInt(nexacro.OSVersion) > 10) {
				nexacro.OSVersion = "11.0";
			}
		}
		else {
			nexacro.OSVersion = _osversion.replace(/_/g, ".");
		}

		var _list = nexacro._findPresetBrand(nexacro.BROWSER_PRESETS, (fullVersionList && fullVersionList.length) ? fullVersionList : brands);
		_browser = _list.brand || browser.name;
		_browserversion = (fullVersionList && fullVersionList.length) ? _list.version || browser.version : _list.brand && osData ? osData.uaFullVersion : _list.version;

		nexacro.Browser = _browser == "edgewebkit" ? "Edge" : _browser;

		if (_browser == "Edge") {
			nexacro.BrowserType = "Edge";
		}
		else if (_browser == "Gecko") {
			nexacro.BrowserType = "Gecko";
		}
		else if (_browser == "Opera") {
			nexacro.BrowserType = "Opera";
		}
		else if (_browser == "edgewebkit") {
			nexacro.BrowserType = "Webkit";
		}
		else {
			nexacro.BrowserType = "WebKit";
		}

		nexacro.BrowserVersion = parseInt(_browserversion, 10);
		nexacro.BrowserMajorVersion = parseInt(_browserversion, 10);

		if (_browser == "Chrome") {
			nexacro._findPresetBrand(nexacro.BROWSER_EXTRA_PRESETS, (fullVersionList && fullVersionList.length) ? fullVersionList : brands);
			nexacro.BrowserExtra = _list.brand || browser.name;
		}
	};

	nexacro._getAccurateAgent = function (callbackFn) {
		if (nexacro._hasUserAgentData()) {
			nexacro._is_ua_loading = true;
			return navigator.userAgentData.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "uaFullVersion", "fullVersionList"]).then(function (info) {
				nexacro._getClientHintsAgent(info);
				callbackFn && callbackFn();
				nexacro._is_ua_loading = false;
			});
		}
		nexacro._getAgent();
		callbackFn && callbackFn();
	};

	nexacro._getAgent = function (userAgent) {
		if (nexacro._hasUserAgentData()) {
			nexacro._getClientHintsAgent();
		}
		else {
			nexacro._getLegacyAgent(userAgent);
		}
	};
	function init_systeminfo () {
		if (nexacro.System) {
			nexacro.System._os == nexacro.OS;
			nexacro.System.computername = nexacro._getComputerName();
			nexacro.System.cpuarchitecture = nexacro._getCPUArchitecture();
			nexacro.System.cpucount = nexacro._getCPUCount();
			nexacro.System.cputype = nexacro._getCPUType();
			nexacro.System.locale = nexacro._getLocale();
			nexacro.System.loginuser = nexacro._getLoginUser();
			nexacro.System.mobileorientation = nexacro._getMobileOrientation();
			nexacro.System.mobilephonenumber = nexacro._getMobilePhoneNumber();
			nexacro.System.mobileproducttype = nexacro._getMobileProductType();
			nexacro.System.mobileuniqueid = nexacro._getMobileUniqueID();
			nexacro.System.monitorcount = nexacro._getMonitorCount();
			nexacro.System.navigatorname = nexacro._getNavigatorName();
			nexacro.System.navigatorversion = nexacro.BrowserVersion;
			nexacro.System.osversion = nexacro._getOSVersion();
			nexacro.System.taskbarsize = nexacro._getTaskbarSize();
			nexacro.System._language = nexacro._getLanguage();
		}
	}
	;


	var userAgentData = navigator.userAgentData;
	var brands = (userAgentData.uaList || userAgentData.brands).slice();
	var platform = (userAgentData.platform || navigator.platform).toLowerCase();
	var _osversion = "-1", _browser = brands[0].brand, _browserversion = brands[0].version;

	var webkitBrand = nexacro._findPresetBrand(nexacro.WEBKIT_PRESETS, brands);
	_webkit = !!webkitBrand.brand;

	var platfomResult = nexacro._findUAInfo(nexacro.OS_PRESETS, function (preset) {
		return new RegExp("" + preset.test, "g").exec(platform);
	});
	nexacro.OS = platfomResult ? platfomResult.id : "";
	nexacro.SystemType = platfomResult ? platfomResult.type : "";

	nexacro.OSVersion = _osversion.replace(/_/g, ".");
	var _list = nexacro._findPresetBrand(nexacro.BROWSER_PRESETS, brands);
	_browser = _list.brand || browser.name;
	_browserversion = _list.version;

	nexacro.Browser = _browser == "edgewebkit" ? "Edge" : _browser;

	if (_browser == "Edge") {
		nexacro.BrowserType = "Edge";
	}
	else if (_browser == "Gecko") {
		nexacro.BrowserType = "Gecko";
	}
	else if (_browser == "Opera") {
		nexacro.BrowserType = "Opera";
	}
	else {
		nexacro.BrowserType = "Webkit";
	}

	nexacro.BrowserVersion = parseInt(_browserversion, 10);
	nexacro.BrowserMajorVersion = parseInt(_browserversion, 10);

	if (_browser == "Chrome") {
		nexacro._findPresetBrand(nexacro.BROWSER_EXTRA_PRESETS, brands);
		nexacro.BrowserExtra = _list.brand || browser.name;
	}

	nexacro._getAccurateAgent(init_systeminfo);
	nexacro._init_uafreezing = true;
}

