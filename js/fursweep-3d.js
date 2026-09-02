/* ==========================================================================
   FURSWEEP — Modèle 3D du produit (Three.js), matériaux PBR, éclairage studio.
   Géométrie fidèle au produit réel : manche bois contourné (lathe, base
   arrondie), collier métallique court, cadre en fil de fer trapézoïdal
   (deux tiges droites), tête de nettoyage cylindrique longue à surface
   striée/enroulée, ton laiton/bronze. Textures bois/métal/laiton générées
   par canvas procédural, pas de photo/texture externe.
   ========================================================================== */
window.FurSweep3D = (function () {
  'use strict';

  function makeWoodTexture(THREE) {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#e6cda0';
    g.fillRect(0, 0, 128, 256);
    /* Nœuds discrets, avant le grain, pour qu'ils se fassent recouvrir
       partiellement par les fibres plutôt que de flotter au-dessus. */
    for (var n = 0; n < 3; n++) {
      var nx = 20 + Math.random() * 88, ny = 30 + Math.random() * 196;
      var nr = 5 + Math.random() * 6;
      var ng = g.createRadialGradient(nx, ny, 0, nx, ny, nr);
      ng.addColorStop(0, 'rgba(150,108,58,0.42)');
      ng.addColorStop(0.6, 'rgba(160,118,66,0.22)');
      ng.addColorStop(1, 'rgba(160,118,66,0)');
      g.fillStyle = ng;
      g.beginPath(); g.ellipse(nx, ny, nr, nr * 1.4, 0, 0, Math.PI * 2); g.fill();
    }
    /* Légère variation de teinte sous-jacente avant les fibres, pour éviter
       un aplat trop uniforme. */
    for (var s = 0; s < 60; s++) {
      g.fillStyle = 'rgba(' + (185 + Math.random() * 30 | 0) + ',' + (145 + Math.random() * 24 | 0) + ',' + (95 + Math.random() * 20 | 0) + ',0.05)';
      g.fillRect(Math.random() * 128, Math.random() * 256, 10 + Math.random() * 26, 4 + Math.random() * 10);
    }
    for (var i = 0; i < 70; i++) {
      var x = Math.random() * 128;
      g.strokeStyle = 'rgba(150,108,60,' + (0.05 + Math.random() * 0.15).toFixed(2) + ')';
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

  function makeSteelTexture(THREE) {
    var c = document.createElement('canvas');
    c.width = 96; c.height = 96;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 96, 96);
    grad.addColorStop(0, '#d4d7d9');
    grad.addColorStop(0.45, '#aeb4b9');
    grad.addColorStop(1, '#82888e');
    g.fillStyle = grad;
    g.fillRect(0, 0, 96, 96);
    /* Grain brossé fin et directionnel (anisotrope) — micro-stries d'un
       acier satiné, pas un dégradé lisse. */
    for (var y3 = 0; y3 < 96; y3++) {
      var shade = (Math.random() - 0.5) * 14;
      g.strokeStyle = 'rgba(' + (shade > 0 ? '255,255,255,' + (shade / 60).toFixed(2) : '30,26,22,' + (-shade / 90).toFixed(2)) + ')';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, y3 + 0.5); g.lineTo(96, y3 + 0.5); g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,0.22)';
    for (var y2 = 0; y2 < 96; y2 += 7) { g.beginPath(); g.moveTo(0, y2); g.lineTo(96, y2 + 3); g.stroke(); }
    /* Léger reflet spéculaire diagonal, comme une source de studio captée
       par la surface satinée. */
    var sheen = g.createLinearGradient(0, 0, 96, 96);
    sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.18)');
    sheen.addColorStop(0.65, 'rgba(255,255,255,0)');
    g.fillStyle = sheen;
    g.fillRect(0, 0, 96, 96);
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function makeBrassTexture(THREE) {
    var c = document.createElement('canvas');
    c.width = 96; c.height = 96;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 96, 96);
    grad.addColorStop(0, '#d3ab6c');
    grad.addColorStop(0.45, '#b6874a');
    grad.addColorStop(1, '#8a6532');
    g.fillStyle = grad;
    g.fillRect(0, 0, 96, 96);
    /* Cannelures fines et légèrement obliques, pour suggérer un fil
       métallique enroulé plutôt que des anneaux parfaitement droits. */
    for (var y = 0; y < 96; y += 2.6) {
      g.strokeStyle = 'rgba(50,32,12,0.4)';
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, y); g.lineTo(96, y + 9); g.stroke();
    }
    for (var y2 = 1.3; y2 < 96; y2 += 2.6) {
      g.strokeStyle = 'rgba(255,232,180,0.22)';
      g.beginPath(); g.moveTo(0, y2); g.lineTo(96, y2 + 9); g.stroke();
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  /* Tige métallique droite entre deux points — pour le cadre trapézoïdal
     (des tiges franches, pas une boucle courbe). */
  function straightRod(THREE, p1, p2, radius, mat, segments) {
    var dir = new THREE.Vector3().subVectors(p2, p1);
    var len = dir.length();
    var geo = new THREE.CylinderGeometry(radius, radius, len, segments || 10);
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(p1).addScaledVector(dir, 0.5);
    var up = new THREE.Vector3(0, 1, 0);
    mesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    return mesh;
  }

  function buildGroup(THREE) {
    var group = new THREE.Group();

    var woodMat = new THREE.MeshStandardMaterial({ map: makeWoodTexture(THREE), roughness: 0.58, metalness: 0.03 });
    var steelMat = new THREE.MeshStandardMaterial({ map: makeSteelTexture(THREE), roughness: 0.38, metalness: 0.82 });
    var brassMat = new THREE.MeshStandardMaterial({ map: makeBrassTexture(THREE), roughness: 0.36, metalness: 0.78 });

    /* Manche : profil tourné (lathe) en une seule pièce continue, sans
       jointures visibles — base arrondie, léger galbe ergonomique, resserré
       vers le collier métallique. */
    var profile = [
      new THREE.Vector2(0.0, -2.78),
      new THREE.Vector2(0.16, -2.75),
      new THREE.Vector2(0.31, -2.63),
      new THREE.Vector2(0.41, -2.4),
      new THREE.Vector2(0.435, -2.05),
      new THREE.Vector2(0.42, -1.55),
      new THREE.Vector2(0.385, -1.0),
      new THREE.Vector2(0.335, -0.5),
      new THREE.Vector2(0.27, -0.14)
    ];
    var handle = new THREE.Mesh(new THREE.LatheGeometry(profile, 28), woodMat);
    group.add(handle);

    /* Collier métallique court, brossé — jonction bois → cadre. */
    var ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.27, 0.34, 24), steelMat);
    ferrule.position.y = 0.03;
    group.add(ferrule);

    /* Cadre en fil de fer : structure trapézoïdale franche — deux tiges
       droites du collier vers les extrémités de la tête, pas une boucle
       arrondie. */
    var connTop = new THREE.Vector3(0, 0.2, 0);
    var headL = new THREE.Vector3(-0.92, 2.86, 0);
    var headR = new THREE.Vector3(0.92, 2.86, 0);
    group.add(straightRod(THREE, new THREE.Vector3(-0.1, 0.16, 0), headL, 0.045, steelMat));
    group.add(straightRod(THREE, new THREE.Vector3(0.1, 0.16, 0), headR, 0.045, steelMat));
    /* Petit sommet arrondi au niveau du collier, pour fermer proprement le
       trapèze plutôt que deux tiges qui se croisent à vif. */
    var apexCap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), steelMat);
    apexCap.position.copy(connTop);
    group.add(apexCap);

    /* Tête de nettoyage : long cylindre métallique à surface striée /
       enroulée, ton laiton — pas de dents, la texture réelle est un
       cannelage fin façon fil enroulé. */
    var head = straightRod(THREE, headL, headR, 0.135, brassMat, 20);
    group.add(head);
    var headCapL = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 10), steelMat);
    headCapL.position.copy(headL);
    group.add(headCapL);
    var headCapR = headCapL.clone();
    headCapR.position.copy(headR);
    group.add(headCapR);

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
