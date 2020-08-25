module.exports = function(app){
	var Dashboard = Object.getPrototypeOf(app).Dashboard = new app.Component("dashboard");
	// Dashboard.debug = true;
	Dashboard.createdAt      = "2.0.0";
	Dashboard.lastUpdate     = "2.0.0";
	Dashboard.version        = "1";
	Dashboard.factoryExclude = true;
	// Dashboard.loadingMsg     = "This message will display in the console when component will be loaded.";

	Dashboard.prototype.onCreate = function(){
		var dashboard = this;

		var strComponents = '';
		for(var component of app.components)
			if (app.components.includes('factory') && !app[app.utils.getClassName(component)].factoryExclude)
				strComponents += '<li><a href="'+window.location.origin+window.location.pathname+'?framnav=factory&component='+component+'">'+app.utils.getClassName(component)+'</a></li>';
			else
				strComponents += '<li>'+app.utils.getClassName(component)+'</li>';

		var strThemes = '';
		for(var theme of app.themes)
			strThemes += '<li>'+theme+'</li>';

		var $body = $(require('mustache-loader!html-loader?interpolate!./templates/index.html')({
			app: app,
			components: strComponents,
			themes: strThemes,
			config: getConfigStr(app.styles, 'global')
		}));

		dashboard.$el.append($body);
	}

	function getConfigStr(obj,title = ''){
		var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/config_section.html');  // noShortcut is used to insert partials later into the final template
		var rows = ''; // the partials mentionned above
		var arrObjects = {}; // used to store and process later the sub-object of config
		var htmlStack = ''; // used to stack the multiple results form arrObjects results
		$.each(obj,function(key,value){
			if(typeof value != 'object'){
				var str = '<span class="ellipsis" title="'+key+'">'+key+' :</span><span>'+value+'</span>';
				if(value.indexOf('#') != -1)
					str = '<span class="ellipsis" title="'+key+'">'+key+' :</span><span class="p-bottom-0" style="border-bottom: 5px solid '+value+'; ">'+value+'</span>';
				rows += require('mustache-loader!html-loader?interpolate!./templates/config_row.html')({str: str});
			} else if (Array.isArray(value)) {
				var str = '<span class="ellipsis" title="'+key+'">'+key+' :</span><span>'+String(value).replace(/,/g,'<br>' )+'</span>';
				rows += require('mustache-loader!html-loader?interpolate!./templates/config_row.html')({str: str});
			}
			else{
				if (title!='global')
					key = title+'-'+key;
				htmlStack += getConfigStr(value, key);
			}
		});
		return template.render({title: title},{rows: rows})+htmlStack; // return the initial template filled with his rows PLUS the stack we get by processing recursively the config
	};

	return Dashboard;
}