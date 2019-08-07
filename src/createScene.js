export default function initialize() {
  const scene = new THREE.Scene();

  let ambientLight = new THREE.AmbientLight(0xfffff0, 1);
  var light = new THREE.DirectionalLight(0xfff0ff, 5);
  var spotLight = new THREE.DirectionalLight(0xff000f, 5);
  light.position.set(-30, 30, 30);
  spotLight.position.set(30, 50, 50);

  const camera = new THREE.Camera();
  scene.add(camera);
  camera.add(light);
  camera.add(ambientLight);
  camera.add(spotLight);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(window.innerWidth * 2, window.innerHeight * 2);

  renderer.domElement.style.width = w;
  renderer.domElement.style.height = h;
  renderer.domElement.width = w * 2;
  renderer.domElement.height = h * 2;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam"
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(
    function onReady() {
      onResize();
    },
    e => console.log(e)
  );

  // handle resize event
  window.addEventListener("resize", function() {
    onResize();
  });

  // create atToolkitContext
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono"
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  function updateScene() {
    if (arToolkitSource.ready) {
      arToolkitContext.update(arToolkitSource.domElement);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,
    renderer,
    arToolkitSource,
    arToolkitContext,
    updateScene,
    render
  };
}
