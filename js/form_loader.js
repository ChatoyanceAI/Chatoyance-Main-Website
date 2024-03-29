var Bitrix24FormLoader = {

	init: function()
	{
		if(!window.Bitrix24FormObject || !window[window.Bitrix24FormObject])
			return;
		if(!window[window.Bitrix24FormObject].forms)
			return;

		this.forms = {};
		this.frameHeight = '200';
		this.defaultNodeId = 'bx24_form_';
		window[window.Bitrix24FormObject].forms.forEach(this.preLoad, this);
	},
	preLoad: function(params)
	{
		var _this = this;
		switch(params.type)
		{
			case 'click':
			case 'button':
			case 'link':
				var defaultNode = document.getElementById(this.defaultNodeId + params.type);
				var defaultClickClassNodeList = document.getElementsByClassName("b24-web-form-popup-btn-" + params.id);
				var click = params.click || null;
				if(!click && defaultClickClassNodeList && defaultClickClassNodeList.length > 0)
				{
					click = [];
					for(var i = 0; i < defaultClickClassNodeList.length; i++)
					{
						click.push(defaultClickClassNodeList.item(i));
					}
				}
				else if(!click && defaultNode)
				{
					click = defaultNode.nextElementSibling;
				}

				if(click && Object.prototype.toString.call(click) != "[object Array]")
				{
					click = [click];
				}

				var formInstance = params;
				if(this.isFormExisted(params))
				{
					formInstance = this.forms[this.getUniqueLoadId(params)];
				}
				click.forEach(function(buttonNode){
					var _this = this;
					this.addEventListener(buttonNode, 'click', function(){_this.showPopup(formInstance);});
				}, this);
				break;
			case 'delay':
				window.setTimeout(
					function(){_this.showPopup(params);},
					1000 * (params.delay ? params.delay : 5)
				);
				break;
			case 'inline':
			default:
				this.load(params);
				break;
		}
	},
	createPopup: function(params)
	{
		if(this.isFormExisted(params))
			return;

		var _this = this;
		var popup = document.createElement('div');

		popup.innerHTML = '' +
			'<div style="display: none; position: fixed; width: 100%; min-height: 100%; background-color: rgba(0,0,0,0.5); overflow: hidden;  z-index: 10000;">' +
				'<div style="position: absolute; top: 50%; left: 50%; margin: 0 auto; min-width: 300px; min-height: 110px; background: #fff; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); transform: translate(-50%, -50%); -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; -webkit-box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.5); -moz-box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.5); box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.5);">' +
					'<div style="position: absolute; top: -10px; right: -10px; cursor: pointer;">' +
						'<div data-bx-form-popup-close="" style="width: 20px; height: 20px; -webkit-border-radius: 50%;  -moz-border-radius: 50%; border-radius: 50%; background: rgba(0,0,0, .5)" >' +
							'<svg viewbox="-5 -5 50 50"><path style="stroke: #fff; fill: transparent; stroke-width: 5;" d="M 10,10 L 30,30 M 30,10 L 10,30" /></svg>' +
						'</div>' +
					'</div>' +
					'<div data-bx-form-popup-cont="" style="margin: 0 auto; min-width: 600px;"></div>' +
				'</div>' +
			'</div>';
		popup = popup.children[0];
		var node = popup.querySelector('[data-bx-form-popup-cont]');
		var btn = popup.querySelector('[data-bx-form-popup-close]');
		this.addEventListener(btn, 'click', function(){_this.hidePopup(params)});
		if(document.body.children[0])
		{
			document.body.insertBefore(popup, document.body.children[0]);
		}
		else
		{
			document.body.appendChild(popup);
		}

		params.popup = popup;
		params.node = node;

		this.addEventListener(window, 'resize', function () {
			_this.resizePopup(params);
		});
	},
	resizePopup: function(form)
	{
		if(!form || !form['popup'] || !form['node'])
		{
			return;
		}

		var interfaceMagic = 100;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = windowHeight - interfaceMagic;
		var needScroll = popupHeight <= form.frameHeight;

		if(needScroll)
		{
			form.node.style['overflow-y'] = 'scroll';
			form.node.style['height'] = popupHeight + 'px';
		}
		else
		{
			form.node.style['overflow-y'] = 'hidden';
			form.node.style.height = null;
		}

		var width = document.documentElement.clientWidth - 20;
		if(width < 300) width = 300;
		else if(width > 600) width = 600;
		form.node.style['min-width'] = width + 'px';
	},
	showPopup: function(params)
	{
		if(!params.popup)
		{
			this.createPopup(params);
			this.load(params);
		}

		if(params.popup)
		{
			params.popup.style.display = 'block';
		}
	},
	hidePopup: function(params)
	{
		params.popup.style.display = 'none';
	},
	createFrame: function(params)
	{
		var formUrl = params.page || (this.domain + '/pub/form.php');
		formUrl += formUrl.indexOf('?') > -1 ? '&' : '?';

		var frame = document.createElement('iframe');
		var frameName = 'bx_form_iframe_' + params.id;
		var locationHash = {
			domain: window.location.protocol + '//' + window.location.host,
			from: window.location
		};
		if(params.fields)
		{
			locationHash.fields = params.fields;
		}
		var frameSrc = formUrl + 'view=frame&' +
			'form_id=' + params.id + '&user_lang=' + params.lang + '&sec=' + params.sec + '&r=' + (1*new Date()) +
			'#' + encodeURIComponent(JSON.stringify(locationHash));

		frame.setAttribute('id', frameName);
		frame.setAttribute('name', frameName);
		frame.setAttribute('src', frameSrc);

		frame.setAttribute('scrolling', 'no');
		frame.setAttribute('frameborder', '0');
		frame.setAttribute('marginheight', '0');
		frame.setAttribute('marginwidth', '0');
		frame.setAttribute('style', 'width: 100%; height: ' + this.frameHeight + 'px; border: 0px; overflow: hidden; padding: 0; margin: 0;'); //max-width: 600px;

		return frame;
	},
	getUniqueLoadId: function(params)
	{
		var type = params.type;
		switch(type)
		{
			case 'click':
			case 'button':
			case 'link':
				type = 'button';
				break;
		}

		return type + '_' + params.id;
	},
	isFormExisted: function(params)
	{
		return !!this.forms[this.getUniqueLoadId(params)];
	},
	load: function(params)
	{
		if(this.isFormExisted(params))
			return;

		var uniqueLoadId = this.getUniqueLoadId(params);
		this.forms[uniqueLoadId] = params;
		var node = params.node ? params.node : null;
		var defaultNode = document.getElementById(this.defaultNodeId + params.type);
		if(!node && !defaultNode)
			return;

		this.domain = params.ref.match(/((http|https):\/\/[^\/]+?)\//)[1];

		var iframe = this.createFrame(params);
		params.iframe = iframe;

		if(node)
			node.appendChild(iframe);
		else
			defaultNode.parentNode.insertBefore(iframe, defaultNode);

		var _this = this;
		this.addEventListener(iframe, 'load', function(){_this.onFrameLoad(uniqueLoadId);});
		this.addEventListener(window, 'message', function(event){
			if(event && event.origin == _this.domain)
			{
				_this.doFrameAction(event.data);
			}
		});
	},
	doFrameAction: function(dataString, uniqueLoadId)
	{
		var data = {};
		try { data = JSON.parse(dataString); } catch (err){}
		if(!data.action || !data.value) return;

		switch (data.action)
		{
			case 'change_height':
				this.setFrameHeight(data.uniqueLoadId || uniqueLoadId, parseInt(data.value));
				break;
			case 'redirect':
				window.location = data.value;
				break;
		}
	},
	checkHash: function(uniqueLoadId)
	{
		var dataString = window.location.hash.substring(1);
		this.doFrameAction(dataString, uniqueLoadId);

		var _this = this;
		setTimeout(function(){_this.checkHash(uniqueLoadId)}, 1000);
	},
	onFrameLoad: function(uniqueLoadId)
	{
		var form = this.forms[uniqueLoadId];

		var ie = 0 /*@cc_on + @_jscript_version @*/;
		if(typeof window.postMessage === 'function' && !ie)
		{
			//init postMessage
			form.iframe.contentWindow.postMessage(JSON.stringify({
				'domain': this.domain,
				'uniqueLoadId': uniqueLoadId
			}), this.domain);
		}
		else
		{
			this.checkHash(uniqueLoadId);
		}

	},

	addEventListener: function(el, eventName, handler)
	{
		el = el || window;
		if (window.addEventListener)
		{
			el.addEventListener(eventName, handler, false);
		}
		else
		{
			el.attachEvent('on' + eventName, handler);
		}		
	},
	
	setFrameHeight: function(uniqueLoadId, height)
	{
		var form = this.forms[uniqueLoadId];
		if(!form)
		{
			return;
		}

		if(form['frameHeight'] && form.frameHeight == height) return;

		form.frameHeight = height;
		form.iframe.style['height'] = height + 'px';

		if(form.popup)
		{
			this.resizePopup(form);
		}
	}
};

Bitrix24FormLoader.init();// JavaScript Document