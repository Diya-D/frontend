"use client";
interface Node {
  id: string;
  name: string;
  type: string;
  children: Node[];
  selected?: boolean;
}
import React, { useEffect, useState } from "react";
import { testData } from "@/testdata";

const TreeNode: React.FC<{ node: Node; level?: number }> = ({
  node,
  level = 0,
}) => {
  const [selected,setSelected]=useState(false)
  const [collapsed, setCollapsed] = useState(true);
  const [children, setChildren] = useState(node.children);
  const [name, setName] = useState(node.name);

  useEffect(() => {
    console.log("inside useEffect", selected);
    let counter = 0;
    const selectAllChildren = (node: Node, selected: boolean): Node => {
      counter += 1;
      return {
        ...node,
        selected,
        children: node.children.map((child) =>
          selectAllChildren(child, selected)
        ),
      };
    };

    const newChildren = selectAllChildren(node, selected).children;
    node.children = newChildren;
    // console.log({ newChildren });
    setChildren(newChildren);
    console.log({ counter });
  }, [selected]);

  const handleSelect = () => {
    setSelected(!selected);
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const style = {
    paddingLeft: `${level * 20}px`, // Increase the left padding as the level increases
  };
  console.log({ name, selected });
  return (
    <div style={style}>
      <input type="checkbox" checked={selected} onChange={handleSelect} />
      <button onClick={handleCollapse}>
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <span>{name}</span>
      {!collapsed &&
        node.children.map((child) => (
          <TreeNode key={child.id} node={child} level={level + 1} />
        ))}
    </div>
  );
};
const Tree: React.FC<{ data: Node }> = ({ data }) => <TreeNode node={data} />;

const Home = () => {
  const addSelectedProperty = (node: Node): Node => {
    return {
      ...node,
      selected: false,
      children: node.children.map(addSelectedProperty),
    };
  };
  const dataWithSelected = addSelectedProperty(testData.rootObject);
  return (
    <div className="App">
      <Tree data={dataWithSelected} />
    </div>
  );
};

export default Home;
