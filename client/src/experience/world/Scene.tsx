import Lights from "./lighting/Lights";
import SceneEnvironment  from "./environment/Environment";
import Effects from "./lighting/Effects";
import CameraRig from "../systems/CameraRig";
import Floor from "./environment/Floor";
import FloatingDust from "./environment/FloatingDust";
import SyncHubLogo from "./objects/SyncHubLogo";
import CameraController from "../systems/CameraController";
import ScrollController from "../systems/ScrollController";
import PlaneCracks from "./environment/PlaneCracks";
import GlassFragments from "./materials/GlassFragments"

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <CameraRig />
      
       <ScrollController />
       <CameraController />
     
      <SceneEnvironment />
     
      <FloatingDust />
      <SyncHubLogo />
   
       {/* <PlaneCracks /> */}
       <GlassFragments />
      <Effects />
    

    </>
  );
}
