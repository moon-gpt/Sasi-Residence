(function(){
    var script = {
 "mouseWheelEnabled": true,
 "defaultVRPointer": "laser",
 "paddingTop": 0,
 "id": "rootPlayer",
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer"
 ],
 "start": "this.init()",
 "contentOpaque": false,
 "scripts": {
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "getKey": function(key){  return window[key]; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "existsKey": function(key){  return key in window; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "unregisterKey": function(key){  delete window[key]; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "registerKey": function(key, value){  window[key] = value; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } }
 },
 "minHeight": 20,
 "width": "100%",
 "scrollBarMargin": 2,
 "downloadEnabled": false,
 "minWidth": 20,
 "borderRadius": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "overflow": "visible",
 "verticalAlign": "top",
 "paddingRight": 0,
 "propagateClick": false,
 "class": "Player",
 "shadow": false,
 "definitions": [{
 "vfov": 180,
 "id": "panorama_8D335A35_800D_56B7_4192_248A2E600BE5",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_4",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 179.58,
   "backwardYaw": -73.81,
   "distance": 1,
   "panorama": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -11.16,
   "backwardYaw": 71.8,
   "distance": 1,
   "panorama": "this.panorama_8D9B8B91_800B_564F_41D6_5B57B940970F"
  }
 ],
 "overlays": [
  "this.overlay_8D33AA35_800D_56B7_41D0_83844E948A3F",
  "this.overlay_8D33BA36_800D_56B5_41B5_EDF5920B36FE"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_t.jpg",
 "class": "Panorama"
},
{
 "vfov": 180,
 "id": "panorama_8D9B8B91_800B_564F_41D6_5B57B940970F",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_5",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 71.8,
   "backwardYaw": -11.16,
   "distance": 1,
   "panorama": "this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5"
  }
 ],
 "overlays": [
  "this.overlay_8D9B9B91_800B_564F_41D3_9A8B52D59176",
  "this.overlay_8D9BAB91_800B_564F_41C1_0384072C3461"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8E868B75_800F_56B7_41C0_CB9CB5DB9215",
 "initialPosition": {
  "yaw": -1.42,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EF1CB95_800F_5674_41B2_897833AFCC41",
 "initialPosition": {
  "yaw": 163.33,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8E44DB10_800F_564D_41D3_5313850BF8E0",
 "initialPosition": {
  "yaw": 153.21,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8D335A35_800D_56B7_4192_248A2E600BE5_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8ED2ABCA_800F_55DD_41AB_ED4A5979F8E5",
 "initialPosition": {
  "yaw": -170.69,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "vfov": 180,
 "id": "panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_1",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -26.79,
   "backwardYaw": -170.72,
   "distance": 1,
   "panorama": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 18.47,
   "backwardYaw": 38.47,
   "distance": 1,
   "panorama": "this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -143.56,
   "backwardYaw": -22.96,
   "distance": 1,
   "panorama": "this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3"
  }
 ],
 "overlays": [
  "this.overlay_8E2E9748_8014_FEDC_41DA_7AE58EAFDDF4",
  "this.overlay_8E2E8748_8014_FEDC_41DB_5DDFD3A65547",
  "this.overlay_8E2EA748_8014_FEDC_41BB_09254E29CCAF"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F2B1C2A_800F_525D_41B7_83946F9352E4",
 "initialPosition": {
  "yaw": -174.89,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EE26BB2_800F_564D_41C9_C83716218505",
 "initialPosition": {
  "yaw": 36.44,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8E5EEAF3_800F_57CC_41CD_5805E2A9F58B",
 "initialPosition": {
  "yaw": -0.42,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F3E8C17_800F_5273_41B2_B5D3DDF54ED8",
 "initialPosition": {
  "yaw": -161.53,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EB0FB2C_800F_5655_41C9_45CA13217470",
 "initialPosition": {
  "yaw": 73.05,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "vfov": 180,
 "id": "panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_8",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -2.55,
   "backwardYaw": 178.58,
   "distance": 1,
   "panorama": "this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4"
  }
 ],
 "overlays": [
  "this.overlay_72D0F4CF_7FF5_53D3_41D5_696F6000434B"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F1BAC40_800F_52CD_41C0_3239B754D0FB",
 "initialPosition": {
  "yaw": 106.19,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EBE0B3E_800F_56B5_41DC_F3FB1A67D3B6",
 "initialPosition": {
  "yaw": 9.28,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8E952B63_800F_56D3_41D0_07F67A76ABAD",
 "initialPosition": {
  "yaw": 157.04,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F505C95_800F_5277_41DB_FC11914FFF60",
 "initialPosition": {
  "yaw": 168.84,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "gyroscopeVerticalDraggingEnabled": true,
 "displayPlaybackBar": true,
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "id": "MainViewerPanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "gyroscopeEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "vfov": 180,
 "id": "panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_6",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 49.61,
   "backwardYaw": 9.31,
   "distance": 1,
   "panorama": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -71.09,
   "backwardYaw": 90,
   "distance": 1,
   "panorama": "this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 178.58,
   "backwardYaw": -2.55,
   "distance": 1,
   "panorama": "this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467"
  }
 ],
 "overlays": [
  "this.overlay_8E1248C4_8015_53D4_41D9_0ECE2F39DE92",
  "this.overlay_8E12A8C4_8015_53D4_41DB_BCC8001AD83E",
  "this.overlay_8E1288C4_8015_53D4_41CB_21EAFCCE0FEF"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_t.jpg",
 "class": "Panorama"
},
{
 "vfov": 180,
 "id": "panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_3",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 9.31,
   "backwardYaw": 49.61,
   "distance": 1,
   "panorama": "this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -73.81,
   "backwardYaw": 179.58,
   "distance": 1,
   "panorama": "this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -170.72,
   "backwardYaw": -26.79,
   "distance": 1,
   "panorama": "this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 107.8,
   "backwardYaw": -106.95,
   "distance": 1,
   "panorama": "this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31"
  }
 ],
 "overlays": [
  "this.overlay_8E86ECCA_8037_53DD_41CB_78F439F950FE",
  "this.overlay_8E86FCCA_8037_53DD_41D0_5BB09BD6D5CF",
  "this.overlay_8E873CCB_8037_53DC_41DA_ADBBCEF872E9",
  "this.overlay_8E870CCB_8037_53DC_41CC_0686BD2A9F0C",
  "this.overlay_8E871CCB_8037_53DC_41C2_C1A113FA9D3A"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8ECE4C01_800F_524F_41DF_06DC86803E8C",
 "initialPosition": {
  "yaw": 177.45,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EDF6BDE_800F_55F4_41D9_25C970B4DB54",
 "initialPosition": {
  "yaw": -90,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "items": [
  {
   "media": "this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_camera"
  },
  {
   "media": "this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_camera"
  },
  {
   "media": "this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_camera"
  },
  {
   "media": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_camera"
  },
  {
   "media": "this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5_camera"
  },
  {
   "media": "this.panorama_8D9B8B91_800B_564F_41D6_5B57B940970F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_camera"
  },
  {
   "media": "this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_camera"
  },
  {
   "media": "this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_camera"
  },
  {
   "media": "this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8E523AD6_800F_57F4_41D1_992E25125B7E",
 "initialPosition": {
  "yaw": -130.39,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8EAB1B52_800F_56CC_41A8_3F252D41A564",
 "initialPosition": {
  "yaw": -141.53,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F770C6E_800F_52D4_41D2_D135F40DD836",
 "initialPosition": {
  "yaw": 108.91,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "vfov": 180,
 "id": "panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_2",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 38.47,
   "backwardYaw": 18.47,
   "distance": 1,
   "panorama": "this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -16.67,
   "backwardYaw": 5.11,
   "distance": 1,
   "panorama": "this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3"
  }
 ],
 "overlays": [
  "this.overlay_8E4C18DE_801B_B3F5_419F_40CC74BD3CF2",
  "this.overlay_8E4C08DE_801B_B3F5_41D8_590E7F8EDB40"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_t.jpg",
 "class": "Panorama"
},
{
 "vfov": 180,
 "id": "panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 5.11,
   "backwardYaw": -16.67,
   "distance": 1,
   "panorama": "this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -22.96,
   "backwardYaw": -143.56,
   "distance": 1,
   "panorama": "this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33"
  }
 ],
 "overlays": [
  "this.overlay_8D72EB9B_8014_B673_41D5_0884C53A4493",
  "this.overlay_8D72DB9B_8014_B673_4196_D0A16FE4947F"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F041C56_800F_52F5_41DB_5E0BB482D452",
 "initialPosition": {
  "yaw": -108.2,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "vfov": 180,
 "id": "panorama_7377C08D_7FF5_B257_41C0_68B956E88B31",
 "frames": [
  {
   "back": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/b/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "front": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/f/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/u/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/r/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/d/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/l/0/{row}_{column}.jpg",
      "rowCount": 3,
      "tags": "ondemand",
      "width": 1536,
      "class": "TiledImageResourceLevel",
      "height": 1536,
      "colCount": 3
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "tags": "ondemand",
      "width": 1024,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "colCount": 2
     },
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "colCount": 1
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "partial": false,
 "label": "APanorama_7",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 90,
   "backwardYaw": -71.09,
   "distance": 1,
   "panorama": "this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -106.95,
   "backwardYaw": 107.8,
   "distance": 1,
   "panorama": "this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1"
  },
  {
   "panorama": "this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467",
   "class": "AdjacentPanorama"
  }
 ],
 "overlays": [
  "this.overlay_7376108D_7FF5_B257_41D0_F1C7853F4E75",
  "this.overlay_7376008D_7FF5_B257_41A0_2D4504515D9C",
  "this.overlay_7376708D_7FF5_B257_41DD_627D46986BAD"
 ],
 "hfov": 360,
 "thumbnailUrl": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_t.jpg",
 "class": "Panorama"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_8F67AC7F_800F_52B3_41D5_90A1CCCBC661",
 "initialPosition": {
  "yaw": -72.2,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "automaticZoomSpeed": 10,
 "initialSequence": {
  "movements": [
   {
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_camera",
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera"
},
{
 "transitionDuration": 500,
 "progressBackgroundOpacity": 1,
 "id": "MainViewer",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarOpacity": 1,
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "progressBarOpacity": 1,
 "width": "100%",
 "progressBorderSize": 0,
 "minHeight": 50,
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarHeadShadowOpacity": 0.7,
 "progressBorderRadius": 0,
 "toolTipPaddingTop": 4,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "minWidth": 100,
 "toolTipPaddingLeft": 6,
 "borderRadius": 0,
 "toolTipDisplayTime": 600,
 "paddingLeft": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipBorderRadius": 3,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarLeft": 0,
 "paddingRight": 0,
 "height": "100%",
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "progressBackgroundColorDirection": "vertical",
 "displayTooltipInTouchScreens": true,
 "progressBarBorderColor": "#000000",
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "toolTipBorderColor": "#767676",
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeight": 10,
 "toolTipOpacity": 1,
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "paddingTop": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "playbackBarRight": 0,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "class": "ViewerArea",
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "shadow": false,
 "playbackBarHeadShadowColor": "#000000",
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "transitionMode": "blending",
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowHorizontalLength": 0,
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D33AA35_800D_56B7_41D0_83844E948A3F",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -11.16,
   "hfov": 16.33,
   "pitch": -44.03,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B4A9A_800F_567D_41CD_7D2DC19B9288",
   "pitch": -44.03,
   "yaw": -11.16,
   "hfov": 16.33,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D9B8B91_800B_564F_41D6_5B57B940970F, this.camera_8F041C56_800F_52F5_41DB_5E0BB482D452); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D33BA36_800D_56B5_41B5_EDF5920B36FE",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_1_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 179.58,
   "hfov": 21.53,
   "pitch": -34.16,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E78BA9A_800F_567D_41C5_35F7E38F6B27",
   "pitch": -34.16,
   "yaw": 179.58,
   "hfov": 21.53,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Left-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1, this.camera_8F1BAC40_800F_52CD_41C0_3239B754D0FB); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D9B9B91_800B_564F_41D3_9A8B52D59176",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 71.8,
   "hfov": 14.45,
   "pitch": -49.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E789A9A_800F_567D_41C7_5A0A9A9D84EC",
   "pitch": -49.89,
   "yaw": 71.8,
   "hfov": 14.45,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5, this.camera_8F505C95_800F_5277_41DB_FC11914FFF60); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D9BAB91_800B_564F_41C1_0384072C3461",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_1_HS_1_0_0_map.gif",
      "width": 51,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 68.49,
   "hfov": 11.67,
   "pitch": -17.87,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E782A9C_800F_5675_4191_3DFB830DEDBD",
   "pitch": -17.87,
   "yaw": 68.49,
   "hfov": 11.67,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Left"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E2E9748_8014_FEDC_41DA_7AE58EAFDDF4",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -26.79,
   "hfov": 15.12,
   "pitch": -26.87,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7A9A96_800F_5675_41C0_A606ADDECC39",
   "pitch": -26.87,
   "yaw": -26.79,
   "hfov": 15.12,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1, this.camera_8EBE0B3E_800F_56B5_41DC_F3FB1A67D3B6); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E2E8748_8014_FEDC_41DB_5DDFD3A65547",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_1_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -143.56,
   "hfov": 14.63,
   "pitch": -42.64,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7AFA96_800F_5675_41D4_20F9F323A476",
   "pitch": -42.64,
   "yaw": -143.56,
   "hfov": 14.63,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3, this.camera_8E952B63_800F_56D3_41D0_07F67A76ABAD); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E2EA748_8014_FEDC_41BB_09254E29CCAF",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_2_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 18.47,
   "hfov": 12.91,
   "pitch": -44.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7A2A96_800F_5673_41B6_724236F93152",
   "pitch": -44.47,
   "yaw": 18.47,
   "hfov": 12.91,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Circle 01b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A, this.camera_8EAB1B52_800F_56CC_41A8_3F252D41A564); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_72D0F4CF_7FF5_53D3_41D5_696F6000434B",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_1_HS_1_0_0_map.gif",
      "width": 16,
      "height": 17,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -2.55,
   "hfov": 13.06,
   "pitch": -51.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "hfov": 13.06,
   "distance": 50,
   "pitch": -51.89,
   "yaw": -2.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467_1_HS_1_0.png",
      "width": 240,
      "height": 258,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Image"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4, this.camera_8E868B75_800F_56B7_41C0_CB9CB5DB9215); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E1248C4_8015_53D4_41D9_0ECE2F39DE92",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -71.09,
   "hfov": 16.91,
   "pitch": -41.03,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E780A9C_800F_5675_41DC_DB1363CFFAF9",
   "pitch": -41.03,
   "yaw": -71.09,
   "hfov": 16.91,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31, this.camera_8EDF6BDE_800F_55F4_41D9_25C970B4DB54); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E12A8C4_8015_53D4_41DB_BCC8001AD83E",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 49.61,
   "hfov": 14.84,
   "pitch": -39.09,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7BEA9C_800F_5675_41CC_17FC337DB0CC",
   "pitch": -39.09,
   "yaw": 49.61,
   "hfov": 14.84,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Left-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1, this.camera_8ED2ABCA_800F_55DD_41AB_ED4A5979F8E5); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E1288C4_8015_53D4_41CB_21EAFCCE0FEF",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 178.58,
   "hfov": 24.13,
   "pitch": 26.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7BDA9C_800F_5675_4186_9AC6554BCA00",
   "pitch": 26.53,
   "yaw": 178.58,
   "hfov": 24.13,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Circle Arrow 02"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_72D094CE_7FF5_53D5_41C7_36FEA6860467, this.camera_8ECE4C01_800F_524F_41DF_06DC86803E8C); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E86ECCA_8037_53DD_41CB_78F439F950FE",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -73.81,
   "hfov": 14.47,
   "pitch": -31.33,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7BAA98_800F_567D_41DA_D81DF2075A62",
   "pitch": -31.33,
   "yaw": -73.81,
   "hfov": 14.47,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D335A35_800D_56B7_4192_248A2E600BE5, this.camera_8E5EEAF3_800F_57CC_41CD_5805E2A9F58B); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E86FCCA_8037_53DD_41D0_5BB09BD6D5CF",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_1_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -170.72,
   "hfov": 14.22,
   "pitch": -42.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7BEA98_800F_567D_41D3_85A3B509B181",
   "pitch": -42.89,
   "yaw": -170.72,
   "hfov": 14.22,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33, this.camera_8E44DB10_800F_564D_41D3_5313850BF8E0); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E873CCB_8037_53DC_41DA_ADBBCEF872E9",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_2_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 9.31,
   "hfov": 13.32,
   "pitch": -27.55,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7BCA98_800F_567D_41DE_FF541ADD8519",
   "pitch": -27.55,
   "yaw": 9.31,
   "hfov": 13.32,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4, this.camera_8E523AD6_800F_57F4_41D1_992E25125B7E); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E870CCB_8037_53DC_41CC_0686BD2A9F0C",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_3_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 107.8,
   "hfov": 12.47,
   "pitch": -51.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B2A9A_800F_567D_41C5_A7B2CADC14AC",
   "pitch": -51.29,
   "yaw": 107.8,
   "hfov": 12.47,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Left-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7377C08D_7FF5_B257_41C0_68B956E88B31, this.camera_8EB0FB2C_800F_5655_41C9_45CA13217470); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E871CCB_8037_53DC_41C2_C1A113FA9D3A",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_4_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 31.47,
   "hfov": 9.14,
   "pitch": 13.49,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B6A9A_800F_567D_41DD_7D3C8CB44F46",
   "pitch": 13.49,
   "yaw": 31.47,
   "hfov": 9.14,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Circle Arrow 02"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E4C18DE_801B_B3F5_419F_40CC74BD3CF2",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_1_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 38.47,
   "hfov": 12.01,
   "pitch": -23.31,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7A0A98_800F_567D_41D3_B1F1A5595A06",
   "pitch": -23.31,
   "yaw": 38.47,
   "hfov": 12.01,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33, this.camera_8F3E8C17_800F_5273_41B2_B5D3DDF54ED8); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8E4C08DE_801B_B3F5_41D8_590E7F8EDB40",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_1_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -16.67,
   "hfov": 11.58,
   "pitch": -21.6,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7A7A98_800F_567D_41B0_26D2F24A6F8E",
   "pitch": -21.6,
   "yaw": -16.67,
   "hfov": 11.58,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3, this.camera_8F2B1C2A_800F_525D_41B7_83946F9352E4); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D72EB9B_8014_B673_41D5_0884C53A4493",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -22.96,
   "hfov": 13.03,
   "pitch": -28.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E745A92_800F_564D_417A_05EE8C8D816A",
   "pitch": -28.5,
   "yaw": -22.96,
   "hfov": 13.03,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33, this.camera_8EE26BB2_800F_564D_41C9_C83716218505); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_8D72DB9B_8014_B673_4196_D0A16FE4947F",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_1_HS_1_0_0_map.gif",
      "width": 36,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 5.11,
   "hfov": 7.86,
   "pitch": -16.97,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7AAA96_800F_5675_41D3_13B502BA8114",
   "pitch": -16.97,
   "yaw": 5.11,
   "hfov": 7.86,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Circle 01b"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A, this.camera_8EF1CB95_800F_5674_41B2_897833AFCC41); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_7376108D_7FF5_B257_41D0_F1C7853F4E75",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_0_0_0_map.gif",
      "width": 51,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 90,
   "hfov": 20.14,
   "pitch": -44.6,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B0A9E_800F_5675_41CA_88EC9AD6BA43",
   "pitch": -44.6,
   "yaw": 90,
   "hfov": 20.14,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Left"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4, this.camera_8F770C6E_800F_52D4_41D2_D135F40DD836); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_7376008D_7FF5_B257_41A0_2D4504515D9C",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_1_0_0_map.gif",
      "width": 51,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -106.95,
   "hfov": 20.44,
   "pitch": -32.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B6A9E_800F_5675_41B1_A7DB8C666461",
   "pitch": -32.53,
   "yaw": -106.95,
   "hfov": 20.44,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Arrow 06a Right"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1, this.camera_8F67AC7F_800F_52B3_41D5_90A1CCCBC661); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "rollOverDisplay": false,
 "id": "overlay_7376708D_7FF5_B257_41DD_627D46986BAD",
 "enabledInCardboard": true,
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 51.53,
   "hfov": 10.97,
   "pitch": 18.98,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "items": [
  {
   "image": "this.AnimatedImageResource_8E7B5A9E_800F_5675_41D0_7C652112AF0E",
   "pitch": 18.98,
   "yaw": 51.53,
   "hfov": 10.97,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "data": {
  "label": "Circle Arrow 02"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "class": "HotspotPanoramaOverlay"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B4A9A_800F_567D_41CD_7D2DC19B9288",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8D335A35_800D_56B7_4192_248A2E600BE5_1_HS_1_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E78BA9A_800F_567D_41C5_35F7E38F6B27",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E789A9A_800F_567D_41C7_5A0A9A9D84EC",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8D9B8B91_800B_564F_41D6_5B57B940970F_1_HS_1_0.png",
   "width": 640,
   "height": 300,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E782A9C_800F_5675_4191_3DFB830DEDBD",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7A9A96_800F_5675_41C0_A606ADDECC39",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_1_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7AFA96_800F_5675_41D4_20F9F323A476",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 20,
 "levels": [
  {
   "url": "media/panorama_8E2EE748_8014_FEDC_41DD_9AD9D1CB1A33_1_HS_2_0.png",
   "width": 1080,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 5,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7A2A96_800F_5673_41B6_724236F93152",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_0_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E780A9C_800F_5675_41DC_DB1363CFFAF9",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_1_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7BEA9C_800F_5675_41CC_17FC337DB0CC",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E1278C3_8015_53D3_41BB_0B406733D3B4_1_HS_2_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7BDA9C_800F_5675_4186_9AC6554BCA00",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7BAA98_800F_567D_41DA_D81DF2075A62",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_1_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7BEA98_800F_567D_41D3_85A3B509B181",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_2_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7BCA98_800F_567D_41DE_FF541ADD8519",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_3_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B2A9A_800F_567D_41C5_A7B2CADC14AC",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E869CC9_8037_53DE_41C8_5B0E1BF78BE1_1_HS_4_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B6A9A_800F_567D_41DD_7D3C8CB44F46",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_1_HS_0_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7A0A98_800F_567D_41D3_B1F1A5595A06",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8E4C28DE_801B_B3F5_41D0_BFE990992A3A_1_HS_1_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7A7A98_800F_567D_41B0_26D2F24A6F8E",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E745A92_800F_564D_417A_05EE8C8D816A",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 20,
 "levels": [
  {
   "url": "media/panorama_8D72FB9B_8014_B673_41CD_C675EF2AB9E3_1_HS_1_0.png",
   "width": 1080,
   "height": 600,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 5,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7AAA96_800F_5675_41D3_13B502BA8114",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_0_0.png",
   "width": 640,
   "height": 300,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B0A9E_800F_5675_41CA_88EC9AD6BA43",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_1_0.png",
   "width": 640,
   "height": 300,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B6A9E_800F_5675_41B1_A7DB8C666461",
 "class": "AnimatedImageResource"
},
{
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_7377C08D_7FF5_B257_41C0_68B956E88B31_1_HS_2_0.png",
   "width": 800,
   "height": 1200,
   "class": "ImageResourceLevel"
  }
 ],
 "rowCount": 6,
 "colCount": 4,
 "frameDuration": 41,
 "id": "AnimatedImageResource_8E7B5A9E_800F_5675_41D0_7C652112AF0E",
 "class": "AnimatedImageResource"
}],
 "scrollBarWidth": 10,
 "desktopMipmappingEnabled": false,
 "height": "100%",
 "scrollBarColor": "#000000",
 "scrollBarVisible": "rollOver",
 "data": {
  "name": "Player485"
 },
 "scrollBarOpacity": 0.5,
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 1,
 "gap": 10,
 "layout": "absolute",
 "horizontalAlign": "left"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
