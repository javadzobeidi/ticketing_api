import { useState } from 'react';

interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, node: TreeNode) => React.ReactNode;
}

interface Props {
  data: TreeNode[];
  value: string | null;
  onChange: (value: string | null) => void;
  idKey?: string;
  titleKey?: string;
  isLoading?: boolean;
  className?: string;
  showSearch?: boolean;
  defaultExpandAll?: boolean;
  columns?: ColumnConfig[];
}

export default function TreeList({ 
  data, 
  value, 
  onChange, 
  idKey = 'id', 
  titleKey = 'title',
  isLoading = false,
  className = '',
  showSearch = true,
  defaultExpandAll = false,
  columns = []
}: Props) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (defaultExpandAll) {
      const allIds = new Set<string>();
      const collectIds = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            allIds.add(node[idKey]);
            collectIds(node.children);
          }
        });
      };
      collectIds(data);
      return allIds;
    }
    return new Set();
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

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
        if (query && node.children && node.children.length > 0) {
          setExpandedNodes(prev => new Set([...prev, node[idKey]]));
        }
      }
      return acc;
    }, []);
  };

  const filteredData = filterTree(data, searchQuery);

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
              ${isSelected ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-600' : ''}
            `}
            onClick={() => {
              if (!hasChildren) {
                onChange(nodeId);
              } else {
                toggleNode(nodeId);
              }
            }}
          >
            {/* Tree controls and title */}
            <div 
              className="flex items-center gap-2 flex-1"
              style={{ paddingRight: `${level * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(nodeId);
                  }}
                  className="flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                </div>
              )}
              
              <span className="text-sm select-none">{node[titleKey]}</span>
            </div>

            {/* Columns */}
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex items-center justify-center"
                style={{ width: col.width || '80px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {col.render 
                  ? col.render(node[col.key], node)
                  : <span className="text-sm text-gray-600">{node[col.key]}</span>
                }
              </div>
            ))}

            {/* Selected indicator */}
            <div className="w-6 flex items-center justify-center">
              {isSelected && (
                <span className="text-blue-600 text-sm font-bold">✓</span>
              )}
            </div>
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

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
        <div className="flex items-center justify-center p-8">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white overflow-hidden ${className}`}>
      {showSearch && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Header with columns */}
      {columns.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
          <div className="flex-1">عنوان</div>
          {columns.map((col) => (
            <div
              key={col.key}
              className="text-center"
              style={{ width: col.width || '80px' }}
            >
              {col.label}
            </div>
          ))}
          <div className="w-6"></div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            هیچ موردی یافت نشد.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {renderTreeNodes(filteredData)}
          </div>
        )}
      </div>
    </div>
  );
}

