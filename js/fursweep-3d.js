/* ==========================================================================
   FURSWEEP — Modèle 3D du produit (Three.js), matériaux PBR, éclairage studio.
   Géométrie construite à partir de primitives (pas de fichier de modèle
   externe) : manche bois conique, virole métal, cadre en fil de fer (tubes
   courbes), tête de nettoyage cylindrique. Textures bois/métal générées par
   canvas procédural, pas de photo/texture externe.
   ========================================================================== */
window.FurSweep3D = (function () {
  'use strict';

  function makeWoodTexture(THREE) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#dcb680';
    g.fillRect(0, 0, 128, 256);
    for (var i = 0; i < 46; i++) {
      var x = Math.random() * 128;
      g.strokeStyle = 'rgba(120,78,38,' + (0.06 + Math.random() * 0.14).toFixed(2) + ')';
      g.lineWidth = 0.6 + Math.random() * 1.6;
      g.beginPath();
      g.moveTo(x, 0);
      g.bezierCurveTo(
        x + (Math.random() - 0.5) * 22, 85,
        x + (Math.random() - 0.5) * 22, 170,
        x + (Math.random() - 0.5) * 16, 256
      );
      g.stroke();
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }

  function makeMetalTexture(THREE, ridged) {
    var c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#c9ccce');
    grad.addColorStop(0.45, '#a6acb1');
    grad.addColorStop(1, '#767d84');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    if (ridged) {
      g.strokeStyle = 'rgba(70,60,40,0.35)';
      g.lineWidth = 1;
      for (var y = 0; y < 64; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(64, y); g.stroke(); }
    } else {
      g.strokeStyle = 'rgba(255,255,255,0.25)';
      for (var y2 = 0; y2 < 64; y2 += 5) { g.beginPath(); g.moveTo(0, y2); g.lineTo(64, y2 + 2); g.stroke(); }
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function buildGroup(THREE) {
    var group = new THREE.Group();

    var woodMat = new THREE.MeshStandardMaterial({ map: makeWoodTexture(THREE), roughness: 0.62, metalness: 0.04 });
    var frameMat = new THREE.MeshStandardMaterial({ map: makeMetalTexture(THREE, false), roughness: 0.42, metalness: 0.8 });
    var headMat = new THREE.MeshStandardMaterial({ map: makeMetalTexture(THREE, true), roughness: 0.48, metalness: 0.72, color: 0xbfa878 });

    /* Manche : légèrement conique, base arrondie, pas un cylindre parfait. */
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.43, 2.25, 24), woodMat);
    handle.position.y = -1.52;
    group.add(handle);
    var base = new THREE.Mesh(new THREE.SphereGeometry(0.43, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), woodMat);
    base.rotation.x = Math.PI;
    base.position.y = -2.63;
    group.add(base);
    var neckTaper = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.33, 0.28, 24), woodMat);
    neckTaper.position.y = -0.28;
    group.add(neckTaper);

    /* Virole métallique. */
    var ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.4, 24), frameMat);
    ferrule.position.y = -0.02;
    group.add(ferrule);

    /* Cadre en fil de fer : deux tubes courbes de la virole vers les
       extrémités de la tête de nettoyage. */
    function wireTube(sign) {
      var pts = [
        new THREE.Vector3(sign * 0.18, 0.16, 0),
        new THREE.Vector3(sign * 1.05, 1.05, 0.06),
        new THREE.Vector3(sign * 1.32, 2.05, 0.06),
        new THREE.Vector3(sign * 0.82, 2.78, 0)
      ];
      var curve = new THREE.CatmullRomCurve3(pts);
      var geo = new THREE.TubeGeometry(curve, 26, 0.05, 8, false);
      return new THREE.Mesh(geo, frameMat);
    }
    group.add(wireTube(-1));
    group.add(wireTube(1));

    /* Tête de nettoyage : barre métallique texturée (crantée), montée entre
       les deux extrémités du cadre. */
    var head = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 1.72, 18), headMat);
    head.rotation.z = Math.PI / 2;
    head.position.y = 2.82;
    group.add(head);
    var headCapL = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), frameMat);
    headCapL.position.set(-0.86, 2.82, 0);
    group.add(headCapL);
    var headCapR = headCapL.clone();
    headCapR.position.set(0.86, 2.82, 0);
    group.add(headCapR);

    /* Centre le groupe verticalement sur son propre milieu (plutôt qu'un
       décalage arbitraire) pour être sûr qu'il tienne entier dans le cadre. */
    group.position.y = -0.3;
    group.scale.set(0.6, 0.6, 0.6);
    return group;
  }

  function init(canvas) {
    var THREE = window.THREE;
    if (!THREE) return null;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    /* Champ de vision resserré + recul de caméra : marge confortable pour
       que le manche et la tête tiennent entiers dans le cadre, même avec
       la légère inclinaison de caméra ajoutée pendant le scroll. */
    var camera = new THREE.PerspectiveCamera(18, 1, 0.1, 30);
    camera.position.set(0, 0.1, 14);

    /* Éclairage studio doux, assourdi pour rester raccord avec la palette
       chaude et mate du site plutôt qu'un rendu trop propre/éclatant. */
    scene.add(new THREE.AmbientLight(0xe8d8bf, 0.42));
    var key = new THREE.DirectionalLight(0xf3dfc0, 0.75);
    key.position.set(3.2, 5, 4.5);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xc9b89e, 0.22);
    fill.position.set(-4, 0.8, 2.4);
    scene.add(fill);
    var rim = new THREE.DirectionalLight(0xe9c9a2, 0.3);
    rim.position.set(-2.2, -1.2, -4);
    scene.add(rim);

    var group = buildGroup(THREE);
    scene.add(group);

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    /* rotZ : rotation principale du trajet (degrés). tilt : -1..1, variation
       de caméra/inclinaison secondaire pour donner une vraie sensation de
       profondeur plutôt qu'un objet toujours de face. */
    function update(rotZ, tilt) {
      tilt = tilt || 0;
      group.rotation.z = (rotZ || 0) * Math.PI / 180;
      group.rotation.y = tilt * 0.6;
      group.rotation.x = 0.1 + tilt * 0.18;
      camera.position.x = tilt * 0.9;
      camera.position.y = 0.3 + tilt * 0.2;
      camera.lookAt(0, 0.2, 0);
      renderer.render(scene, camera);
    }

    return { update: update, resize: resize };
  }

  return { init: init };
})();
