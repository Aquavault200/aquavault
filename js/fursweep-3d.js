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
    /* Nœuds discrets, avant le grain, pour qu'ils se fassent recouvrir
       partiellement par les fibres plutôt que de flotter au-dessus. */
    for (var n = 0; n < 3; n++) {
      var nx = 20 + Math.random() * 88, ny = 30 + Math.random() * 196;
      var nr = 5 + Math.random() * 6;
      var ng = g.createRadialGradient(nx, ny, 0, nx, ny, nr);
      ng.addColorStop(0, 'rgba(96,60,28,0.5)');
      ng.addColorStop(0.6, 'rgba(110,70,34,0.28)');
      ng.addColorStop(1, 'rgba(110,70,34,0)');
      g.fillStyle = ng;
      g.beginPath(); g.ellipse(nx, ny, nr, nr * 1.4, 0, 0, Math.PI * 2); g.fill();
    }
    /* Légère variation de teinte sous-jacente avant les fibres, pour éviter
       un aplat trop uniforme. */
    for (var s = 0; s < 60; s++) {
      g.fillStyle = 'rgba(' + (150 + Math.random() * 30 | 0) + ',' + (100 + Math.random() * 24 | 0) + ',' + (50 + Math.random() * 20 | 0) + ',0.05)';
      g.fillRect(Math.random() * 128, Math.random() * 256, 10 + Math.random() * 26, 4 + Math.random() * 10);
    }
    for (var i = 0; i < 70; i++) {
      var x = Math.random() * 128;
      g.strokeStyle = 'rgba(120,78,38,' + (0.05 + Math.random() * 0.16).toFixed(2) + ')';
      g.lineWidth = 0.5 + Math.random() * 1.5;
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
    c.width = 96; c.height = 96;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 96, 96);
    grad.addColorStop(0, '#c9ccce');
    grad.addColorStop(0.45, '#a6acb1');
    grad.addColorStop(1, '#767d84');
    g.fillStyle = grad;
    g.fillRect(0, 0, 96, 96);
    /* Grain brossé fin et directionnel (anisotrope), plus réaliste qu'un
       simple dégradé lisse — imite les micro-stries d'un métal satiné. */
    for (var y3 = 0; y3 < 96; y3++) {
      var shade = (Math.random() - 0.5) * 14;
      g.strokeStyle = 'rgba(' + (shade > 0 ? '255,255,255,' + (shade / 60).toFixed(2) : '30,26,22,' + (-shade / 90).toFixed(2)) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, y3 + 0.5); g.lineTo(96, y3 + 0.5); g.stroke();
    }
    if (ridged) {
      g.strokeStyle = 'rgba(60,50,32,0.4)';
      g.lineWidth = 1;
      for (var y = 0; y < 96; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(96, y); g.stroke(); }
    } else {
      g.strokeStyle = 'rgba(255,255,255,0.22)';
      for (var y2 = 0; y2 < 96; y2 += 7) { g.beginPath(); g.moveTo(0, y2); g.lineTo(96, y2 + 3); g.stroke(); }
    }
    /* Un léger reflet spéculaire diagonal, comme une source de studio
       captée par la surface satinée. */
    var sheen = g.createLinearGradient(0, 0, 96, 96);
    sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.16)');
    sheen.addColorStop(0.65, 'rgba(255,255,255,0)');
    g.fillStyle = sheen;
    g.fillRect(0, 0, 96, 96);
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

    /* Double rangée de dents métalliques, fines et pointues, suspendues sous
       la barre — c'est la caractéristique du produit ("tête à double
       rangée de dents") et elle manquait entièrement au modèle jusqu'ici. */
    var teethMat = new THREE.MeshStandardMaterial({ map: makeMetalTexture(THREE, false), roughness: 0.3, metalness: 0.85 });
    var toothGeo = new THREE.ConeGeometry(0.02, 1, 7);
    var headBottom = 2.82 - 0.115;
    var rowsZ = [-0.05, 0.05];
    var teethPerRow = 15;
    for (var r = 0; r < rowsZ.length; r++) {
      for (var ti = 0; ti < teethPerRow; ti++) {
        var tx = -0.78 + (1.56 * ti / (teethPerRow - 1));
        var tLen = 0.19 + Math.random() * 0.05;
        var tooth = new THREE.Mesh(toothGeo, teethMat);
        tooth.scale.set(1, tLen, 1);
        tooth.rotation.x = Math.PI;
        tooth.rotation.y = (Math.random() - 0.5) * 0.12;
        tooth.position.set(tx, headBottom - tLen / 2, rowsZ[r]);
        group.add(tooth);
      }
    }

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
    var camera = new THREE.PerspectiveCamera(22, 1, 0.1, 40);

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

    /* Cadrage robuste à toute rotation : on centre le groupe sur sa propre
       sphère englobante (invariante par rotation, contrairement à une boîte
       axis-aligned) puis on place la caméra à la distance minimale garantissant
       qu'elle tienne dans le champ de vision, avec une marge de sécurité. */
    var box = new THREE.Box3().setFromObject(group);
    var sphere = box.getBoundingSphere(new THREE.Sphere());
    group.position.sub(sphere.center);
    var fovRad = camera.fov * Math.PI / 180;
    var safetyMargin = 1.4;
    var camDist = (sphere.radius * safetyMargin) / Math.sin(fovRad / 2);
    camera.position.set(0, 0, camDist);

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
      camera.position.y = tilt * 0.2;
      camera.position.z = camDist;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    return { update: update, resize: resize };
  }

  return { init: init };
})();
