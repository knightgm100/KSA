(() => {
  const container = document.getElementById('globe-canvas');
  if (!container || !window.THREE || !window.gsap) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 4.3);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1200; textureCanvas.height = 600;
  const context = textureCanvas.getContext('2d');
  context.fillStyle = '#071e1a'; context.fillRect(0, 0, 1200, 600);
  context.strokeStyle = 'rgba(79, 174, 115, .16)'; context.lineWidth = 1;
  for (let x = 0; x <= 1200; x += 60) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 600); context.stroke(); }
  for (let y = 0; y <= 600; y += 60) { context.beginPath(); context.moveTo(0, y); context.lineTo(1200, y); context.stroke(); }
  context.fillStyle = '#0c4f38';
  const landmasses = [[90,190,170,120],[220,230,140,170],[400,170,120,190],[540,260,180,120],[690,180,150,170],[820,250,160,130],[970,160,150,190],[1030,390,100,75],[330,420,140,95]];
  landmasses.forEach(([x,y,w,h]) => { context.beginPath(); context.ellipse(x, y, w / 2, h / 2, -.2, 0, Math.PI * 2); context.fill(); });
  const fallbackTexture = new THREE.CanvasTexture(textureCanvas);
  const globeMaterial = new THREE.MeshBasicMaterial({ map: fallbackTexture });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), globeMaterial);
  scene.add(globe);
  const earthLoader = new THREE.TextureLoader();
  earthLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', (earthTexture) => {
    earthTexture.encoding = THREE.sRGBEncoding;
    globeMaterial.map = earthTexture;
    globeMaterial.needsUpdate = true;
  });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.54, 48, 48), new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0, side:THREE.BackSide }));
  scene.add(atmosphere);
  scene.add(new THREE.AmbientLight(0x7fbea0, 1.05));
  const keyLight = new THREE.DirectionalLight(0xffdca4, 1.65); keyLight.position.set(-4, 3, 4); scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x1cb66a, 0, 8); rimLight.position.set(2, -1, 3); scene.add(rimLight);

  const marker = new THREE.Group();
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.052, 16, 16), new THREE.MeshBasicMaterial({ color:0xe6bd67 }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(.085, .1, 32), new THREE.MeshBasicMaterial({ color:0xe6bd67, transparent:true, opacity:.9, side:THREE.DoubleSide }));
  marker.add(dot, ring);
  const lat = 23.8859 * Math.PI / 180, lon = 45.0792 * Math.PI / 180;
  marker.position.set(1.5 * Math.cos(lat) * Math.sin(lon), 1.5 * Math.sin(lat), 1.5 * Math.cos(lat) * Math.cos(lon));
  marker.lookAt(0, 0, 0); globe.add(marker);
  const saudiFocusRotation = Math.atan2(-marker.position.x, marker.position.z);
  globe.rotation.y = saudiFocusRotation;

  const resize = () => { const width = container.clientWidth, height = container.clientHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); };
  window.addEventListener('resize', resize); resize();
  const clock = new THREE.Clock();
  function render() { const elapsed = clock.getElapsedTime(); ring.scale.setScalar(1 + Math.sin(elapsed * 3) * .15); renderer.render(scene, camera); requestAnimationFrame(render); }
  render();

  gsap.registerPlugin(ScrollTrigger);
  const heroTimeline = gsap.timeline({ scrollTrigger: { trigger: '.hero-scroll', start: 'top top', end: 'bottom bottom', scrub: true } });
  heroTimeline.to('.hero-copy', { x: 110, opacity: 0, scale: 1.32, ease:'power2.in' }, .12)
    .to('.globe-stage', { x: '23vw', y: '7vh', scale: 1.65, ease:'power1.inOut' }, .05)
    .to(camera.position, { z: 2.9, y: .1, ease:'power1.inOut' }, .08)
    .to('.location-label', { opacity: 1, scale: 1.12, ease:'power1.inOut' }, .45);

  gsap.to('.timeline-line span', { height:'100%', ease:'none', scrollTrigger:{ trigger:'.timeline-wrap', start:'top 70%', end:'bottom 75%', scrub:1 } });
  gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.to(item, { opacity:1, y:0, duration:.8, ease:'power2.out', scrollTrigger:{ trigger:item, start:'top 78%', toggleActions:'play none none reverse' } });
  });
  gsap.from('.legacy-card', { y:80, opacity:0, duration:1.1, ease:'power3.out', scrollTrigger:{ trigger:'.legacy-section', start:'top 68%', toggleActions:'play none none reverse' } });
})();
