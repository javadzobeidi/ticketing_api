import { useState } from 'react';

interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

interface Props {
  data: TreeNode[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  idKey?: string;
  titleKey?: string;
  isLoading?: boolean;
  inputClass?: string;
  allowMultiple?: boolean;
}

 function TreeViewField({ 
  data, 
  placeholder = "انتخاب کنید...", 
  value, 
  onChange, 
  idKey = 'id', 
  titleKey = 'title',
  isLoading = false,
  inputClass = '',
  allowMultiple = false
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Find selected node
  const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node[idKey] === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = value ? findNode(data, value) : null;

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Filter tree based on search
  const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
    if (!query) return nodes;
    
    return nodes.reduce((acc: TreeNode[], node) => {
      const matchesSearch = node[titleKey]?.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      
      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        });
      }
      return acc;
    }, []);
  };

  const filteredData = filterTree(data, searchQuery);

  // Render tree nodes recursively
  const renderTreeNodes = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map((node) => {
      const nodeId = node[idKey];
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(nodeId);
      const isSelected = value === nodeId;

      return (
        <div key={nodeId} className="w-full">
          <div
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer
              hover:bg-gray-100 transition-colors
              ${isSelected ? 'bg-blue-50 text-blue-900' : ''}
            `}
            style={{ paddingRight: `${level * 20 + 12}px` }}
            onClick={() => {
              if (!hasChildren) {
                onChange(nodeId);
                setIsOpen(false);
                setSearchQuery('');
              } else {
                toggleNode(nodeId);
              }
            }}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(nodeId);
                }}
                className="flex items-center justify-center w-4 h-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            
            <span className="flex-1 text-sm">{node[titleKey]}</span>
            
            {isSelected && (
              <span className="text-blue-600 text-sm">✓</span>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div>
              {renderTreeNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full">
      {/* INPUT + TRIGGER */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          readOnly={!isOpen}
          value={isOpen ? searchQuery : (selectedNode?.[titleKey] ?? '')}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={() => setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          className={`
            w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900
            placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
            cursor-pointer ${inputClass}
          `}
        />
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-3 flex items-center justify-center text-gray-500 hover:text-blue-600"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          />
          
          {/* Popup */}
          <div className="absolute z-50 mt-1 w-full">
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filteredData.length === 0 ? (
                <div className="p-3 text-gray-400 text-sm text-center">
                  هیچ موردی یافت نشد.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {renderTreeNodes(filteredData)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default TreeViewField;