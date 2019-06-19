var kris = angular.module('home', []);

kris.controller('homeController', function($scope, $http) {
    // alert("test");
    if(localStorage.accessToken) {
      try {
          window.atob(localStorage.accessToken);
          location.href="/auth/callback/200/"+localStorage.accessToken;
      } catch(e) {
        localStorage.clear();
          location.href="/auth/callback/401/error";
      }

    }
    $scope.show2a = false;

    $scope.showKristals = true;
    $scope.error = "";
    $scope.success = "";
    $scope.subscribeError = '';
    $scope.subscribeEmail = '';
    $scope.name = '';
    $scope.email = '';
    $scope.message = '';
    $scope.phone = '';
    $scope.connectError = '';
    $scope.connectSuccess = "";
    // $scope.iframeUrl = "https://portal.investo2o.com/portfolio/kristals/public/join-us";
    // 
    $scope.isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) $scope.isMobile = true;

    //--------------- Country Specific Website---------------
    pathArray = location.href.split( '/' );
    console.log('pathArray', pathArray)
    if ( pathArray[pathArray.length - 2] == 'ind' ) {
        $scope.country = 'IND'
    } else if ( pathArray[pathArray.length - 2] == 'sgp' ) {
        $scope.country = 'SGP'
    } else if ( pathArray[pathArray.length - 2] == 'hkg' ) {
        $scope.country = 'HKG'
    } else {
        $scope.country = 'NA'
    }


        if (pathArray[2] == '52.5.56.221:8080') {
            $scope.baseUrl = 'https://staging.investo2o.com';
            $scope.baseUrl1 = 'https://staging.investo2o.com';
            $scope.iframeUrl = 'https://staging.investo2o.com/portfolio/kristals/public/join-us';

        } else if(pathArray[2] == 'investo2o.com') {
            $scope.baseUrl = 'https://portal.investo2o.com';
            $scope.baseUrl1 = 'https://services.investo2o.com';
            $scope.iframeUrl = 'https://portal.investo2o.com/portfolio/kristals/public/join-us';

        } else {
            $scope.baseUrl = 'https://portal.investo2o.com';
            $scope.baseUrl1 = 'https://services.investo2o.com';
            $scope.iframeUrl = 'https://portal.investo2o.com/portfolio/kristals/public/join-us';
        }


        // Browser Type
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
            // At least Safari 3+: "[object HTMLElementConstructor]"
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
            // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
            // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
            // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;

        var userAgent = window.navigator.userAgent;

        if(isFirefox != 1 && isChrome != 1) {
            $scope.demoUrl = $scope.baseUrl+"/support";
        } else {
            if ( $scope.country == 'IND' ) {
            username = 'abc_india'
            } else {
              username = 'abc'
            }
            console.log('username', username)
            $http.get($scope.baseUrl1+"/auth-ws/local/oauth?username=" + username + "&password=abc", {
            headers: {'User-IP': sessionStorage.ip, 'Agent': navigator.userAgent}}).success(function(data) {
                console.log(data['Access-Token']);
                $scope.demoUrl = $scope.baseUrl+"/auth/callback/200/"+data['Access-Token']

            });
        }

        
        
        
    



    $scope.login = function() {
        // var md = new MobileDetect(window.navigator.userAgent);
        // var os = md.os();
        // console.log(os);
        // if (os == "iOS") {
        //     window.location.href = $scope.baseUrl+"/download/ios"
        // } else if (os == "AndroidOS") {
        //     window.location.href = $scope.baseUrl+"/download/android"
        // } else {
            window.location.href = $scope.baseUrl+"/login"
        // }

    }

    $scope.gotoComp = function() {
        window.location.href = $scope.baseUrl+"/stock-challenge/#/join-us"
    }

    $scope.signup = function() {
        // var md = new MobileDetect(window.navigator.userAgent);
        // var os = md.os();
        // console.log(os);
        // if (os == "iOS") {
        //     window.location.href = $scope.baseUrl+"/download/ios"
        // } else if (os == "AndroidOS") {
        //     window.location.href = $scope.baseUrl+"/download/android"
        // } else {
            window.location.href = $scope.baseUrl+"/signup"
        // }

    }

    $scope.openVideo = function() {
        $scope.showVideo = 1;
        
    }

    $scope.closeVideo = function() {
        $scope.showVideo = 0;

    }

    $scope.connect = function(url) {
        $scope.error = "";
        if($scope.terms == 0){
            $scope.error = "Please accept the Terms of Service and Privacy policy before signing up";
        } else {
            window.location.href="https://portal.investo2o.com/auth-ws/"+url+"/oauth";
        }
    }

    $scope.subscribe = function() {
        $scope.subscribeError = '';
        if ($scope.subscribeEmail == '') {
            $scope.subscribeError = 'Email required';
            return;
        }

        $scope.success = "Thank you for subscribing. We'll keep you posted with the latest activites!";
        
        $http({
              method: 'POST',
              url: 'https://services.investo2o.com/auth-ws/api/v1/contactus/saveKeepMePosted',
              data :{
                   email: $scope.subscribeEmail
                  }
        }).then(function(data) {
            console.log(data);
            $scope.subscribeEmail = '';
            
        });

    }


    $scope.contact = function() {
        $scope.connectError = '';

        if ($scope.name == '' || $scope.email == '' ||$scope.phone == '' ||$scope.message == '' ||$scope.name == '') {
            $scope.connectError = 'All fields are required!';
            return;
        }

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test($scope.email)) {
            $scope.error = 'Enter a valid email';
            return;
        }

        var country = '+' + $("#phone").intlTelInput("getSelectedCountryData").dialCode;
        var phone = country + '-' + $scope.phone;
        
        $scope.connectSuccess = "We've recieved your message. <br/>Will get back to you within two business days.";

        $http({
              method: 'POST',
              url: 'https://services.investo2o.com/auth-ws/api/v1/contactus/saveContactUs',
              data :{
                      name: $scope.name,
                      email: $scope.email,
                      phoneNumber: phone,
                      subject: '',
                      text: $scope.message
                  }
        }).then(function(data) {
            console.log(data);
            $scope.name = '';
            $scope.email = '';
            $scope.message = '';
            $scope.phone = '';
            
        });
    }


    // Animations
//     window.sr = ScrollReveal();
//     sr.reveal('.krisAnmS1');
//     sr.reveal('.krisStat');
//     sr.reveal('.krisAnmC1');
//     sr.reveal('.krisAnmC2');
//     sr.reveal('.krisAnmC3');
//     sr.reveal('.krisAnmC4');
//     sr.reveal('.krisAnmC5');

   
    

    // highmaps
    
    $scope.mapFunc = function() {

      if ( typeof Highcharts != 'undefined') {
        Highcharts.mapChart('map1', {

            title: {
                text: 'Kristals – Exposure by country'
            },

            legend: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false
                    }
                }
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom',
                    enableMouseWheelZoom: false,
                    enableTouchZoom: false
                }
            },

            tooltip: {
                formatter: function () {
                    return this.point.name + '<br>' +
                         this.point.value + ' Kristals';
                }
                // backgroundColor: '#fff',
                // borderWidth: 1,
                // shadow: true,
                // useHTML: true,
                // padding: 0,
                // pointFormat:
                    // ' {point.name}: <b>{point.value}</b>',
                // positioner: function () {
                //     return { x: 0, y: 250 };
                // }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'linear',
                minColor: '#2D3749',
                maxColor: '#2D3749',
            },

            series: [{
                data: $scope.mapPoints,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a3', 'code'],
                name: 'Kristals',
                states: {
                    hover: {
                        color: '#969696'
                    }
                }
            }]
        });
        Highcharts.mapChart('map2', {

            title: {
                text: 'Kristals – Exposure by country'
            },

            legend: {
                enabled: false
            },

            credits: {
                enabled: false
            },

            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false
                    }
                }
            },

            mapNavigation: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    return this.point.name + '<br>' +
                         this.point.value + ' Kristals';
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'linear',
                minColor: '#2D3749',
                maxColor: '#2D3749',
            },

            series: [{
                data: $scope.mapPoints,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a3', 'code'],
                name: 'Kristals',
                states: {
                    hover: {
                        color: '#969696'
                    }
                }
            }]
        });
      }
    }
    // $.getJSON('https://s3-ap-southeast-1.amazonaws.com/kristal-prod-ui/Kristals/kristal_countries.json&callback=?', function (data) {
    $http.get('https://s3-ap-southeast-1.amazonaws.com/kristal-prod-ui/Kristals/kristal_countries.json').then(function successCallback(res) {
        console.log('countries of kristals',res);
        data = res.data;
        $scope.mapPoints = res.data;
        $scope.mapFunc()
    });

    // join-us SPECIFIC WEBSITE
    $scope.isDropdownOpen = false
    $scope.toggleCountrySubmenu = function (ev) {
        ev.stopPropagation()
        $scope.isDropdownOpen = !$scope.isDropdownOpen
        $scope.isLangDropdownOpen = false
    }
    //closing nacbar submenu
    $scope.closeCountrySubmenu = function(){
        $scope.isDropdownOpen = false
        $scope.isLangDropdownOpen = false
    }

    // LANGUAGE SPECIFIC WEBSITE
    $scope.isLangDropdownOpen = false
    $scope.toggleLangSubmenu = function (ev) {
        ev.stopPropagation()
        $scope.isLangDropdownOpen = !$scope.isLangDropdownOpen
        $scope.isDropdownOpen = false
    }
    //closing nacbar submenu
    $scope.closeLangSubmenu = function(){
        $scope.isLangDropdownOpen = false
    }

    

    $("input[type=radio]").each(function() {
        var currInputName = $(this).attr('name');
        console.log('currInputName', currInputName)

        if(currInputName == 'IND') {
            $(this).prop("checked", true);
        }

    });

    sessionStorage.country = $scope.country 

    // check for browser
    $scope.isBrowserCompatible = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

    console.log('$scope.isBrowserCompatible', $scope.isBrowserCompatible)

    $scope.setUrlForTour = function () {
        // $http.get('/getBaseUrl').success(function(data) {
        //         if (data == 'https://staging.investo2o.com') {
        //             $scope.baseUrl = 'https://staging.investo2o.com';
        //             $scope.baseUrl1 = 'https://staging.investo2o.com';

        //         } else if(data == 'http://52.11.86.41' || data == 'http://dev.investo2o.com') {
        //             $scope.baseUrl = 'http://dev.investo2o.com';
        //             $scope.baseUrl1 = 'http://dev.investo2o.com';
        //         } else {
        //             $scope.baseUrl = 'https://portal.investo2o.com';
        //             $scope.baseUrl1 = 'https://services.investo2o.com';
        //         }




        if($scope.country == "IND") {
            u_name = "abc_india"
        } else {
            u_name = "abc"
        }


        $http.get($scope.baseUrl1+"/auth-ws/local/oauth?username=" + u_name + "&password=abc", {
        headers: {'User-IP': sessionStorage.ip, 'Agent': navigator.userAgent}}).success(function(data) {

            console.log(data['Access-Token']);
            console.log(data)
            $scope.demoUrl = $scope.baseUrl+"/auth/callback/200/"+data['Access-Token']

        });
        $.each(document.images, function(){
            var this_image = this;
            var src = $(this_image).attr('src') || '' ;
            if(!src.length > 0){
                //this_image.src = options.loading; // show loading
                var lsrc = $(this_image).attr('lsrc') || '' ;
                if(lsrc.length > 0){
                    var img = new Image();
                    img.src = lsrc;
                    $(img).load(function() {
                        this_image.src = this.src;
                   });
                }
            }
       });

        //     });
        
    }


    $scope.changeCountry = function(country, ev) {
        if(ev && country === $scope.country) {
            ev.stopPropagation()
            $scope.isDropdownOpen=false
            return
        }
        if(ev) {
            ev.stopPropagation()
            $scope.isDropdownOpen=false
            $scope.country = country
           // Initialize Slider
            setTimeout(function(){
                window.scrollTo(0, 10);
                $('.krisSlider').slick('reinit')
                $('.krisSlideraboutUS').slick('reinit')
            
            }, 2000);
        }
        if ( country == 'IND' ) {
          window.location.href = '../ind';
          sessionStorage.country = 'IND'
        } else if ( country == 'SGP' ) {
          window.location.href = '../sgp';
          sessionStorage.country = 'SGP'
        } else if ( country == 'HKG' ) {
          window.location.href = '../hkg';
          sessionStorage.country = 'HKG'
        } else {
          window.location.href = '../contact';
        }
        $scope.setUrlForTour()
        $scope.closeCountrySubmenu()
    }

    // $scope.changeCountry($scope.country)

    $(function(){
        $.each(document.images, function(){
            var this_image = this;
            var src = $(this_image).attr('src') || '' ;
            if(!src.length > 0){
                //this_image.src = options.loading; // show loading
                var lsrc = $(this_image).attr('lsrc') || '' ;
                if(lsrc.length > 0){
                    var img = new Image();
                   img.src = lsrc;
                   $(img).load(function() {
                       this_image.src = this.src;
                   });
                }
           }
       });
    });

    $scope.language = 'ENG'
    $scope.changeLang = function (lang, ev) {
        $scope.language = lang
        $scope.isLangDropdownOpen = false
        if($scope.language == 'ENG') {
            $scope.content = $scope.worldwide_content[0].content;
        } else if($scope.language == 'CHI') {
            $scope.content = $scope.worldwide_content[1].content;
        }
        $scope.viewType = $scope.content.section2.buttons[0];
    }


    
    $scope.animate = function() {
        var div = $("#vsl1");
        div.css("z-index", "2")
        // div.animate({height: '300px', opacity: '0.4'}, "slow");
        div.animate({width: '200%', opacity: '1'}, "slow");
    }


    // Website Content
    
    $http.get('../website_content.json').then(function successCallback(res) {
        $scope.worldwide_content = res.data[0].body;
        $scope.content = $scope.worldwide_content[0].content;
        console.log('$scope.content1', $scope.content1)

         // Toggle between List view and map view
        $scope.viewType = $scope.content.section2.buttons[0];
        $( ".btnToToggle" ).click(function() {
            $( ".viewToToggle" ).toggle( "fast" );
            if($scope.viewType == $scope.content.section2.buttons[0]){
                if ( typeof Highcharts != 'undefined') {
                        $scope.viewType = $scope.content.section2.buttons[1];
                        $scope.mapFunc();
                }   
            } else {
                  $scope.viewType = $scope.content.section2.buttons[0];
            }         
        });
    });

});
