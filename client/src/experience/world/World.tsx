import Environment from "./environment/Environment";
import Lights from "./lighting/Lights";
import TestCube from "./objects/TestCube";

export default function World() {
  return (
    <>
      <Environment />

      <Lights />

      <TestCube />
    </>
  );
}