interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

export default class Utils {
 
     static findParent(
    nodes: TreeNode[], 
    targetId: string, 
    idKey: string = 'id',
    parent: TreeNode | null = null
  ): TreeNode | null {
    console.log("First parent is :",parent);
    for (const node of nodes) {

      if (node[idKey] === targetId) {

        if (parent===null)
        {
            return node;
        }
        console.log("Parent is :",parent)
        return parent;
      }

      if (node.children && node.children.length > 0) {
        const found = Utils.findParent(node.children, targetId, idKey, node);
        if (found !== null) return found;
      }
    }

    return null;
  }


  static findPath(
    nodes: TreeNode[], 
    targetId: string, 
    idKey: string = 'id',
    currentPath: TreeNode[] = []
  ): TreeNode[] | null {
    for (const node of nodes) {
      const newPath = [...currentPath, node];
      
      if (node[idKey] === targetId) {
        return newPath;
      }
      
      if (node.children) {
        const found = Utils.findPath(node.children, targetId, idKey, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  static findNode(
    nodes: TreeNode[], 
    targetId: string, 
    idKey: string = 'id'
  ): TreeNode | null {
    for (const node of nodes) {
      if (node[idKey] === targetId) return node;
      if (node.children) {
        const found = Utils.findNode(node.children, targetId, idKey);
        if (found) return found;
      }
    }
    return null;
  }
}