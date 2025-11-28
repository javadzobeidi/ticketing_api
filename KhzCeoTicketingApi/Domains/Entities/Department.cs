using System.ComponentModel.DataAnnotations.Schema;

namespace KhzCeoTicketingApi.Domains.Entities;

[Table("Department")]
public class Department
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool IsActive { set; get; }
    
    public int? ParentId { get; set; }
    public Department Parent { get; set; }
    
    public ICollection<Department> Children { get; set; } = new List<Department>();

    public ICollection<BranchDepartment> BranchDepartments { get; set; }

    public List<Department> GetFullHierarchy(List<Department> all)
    {
        var result = new List<Department>();

        // 1. Parents
        result.AddRange(GetParents(all));

        // 2. Itself
        result.Add(this);

        // 3. Children
        result.AddRange(GetChildren(all));

        return result.Distinct().ToList();
    }

    private List<Department> GetParents(List<Department> all)
    {
        var result = new List<Department>();

        var current = this;

        while (current.ParentId != null)
        {
            var parent = all.FirstOrDefault(x => x.Id == current.ParentId);
            if (parent == null) break;

            result.Add(parent);
            current = parent;
        }

        return result;
    }

    private List<Department> GetChildren(List<Department> all)
    {
        var result = new List<Department>();

        var directChildren = all.Where(x => x.ParentId == this.Id).ToList();

        foreach (var child in directChildren)
        {
            result.Add(child);
            result.AddRange(child.GetChildren(all)); // recursion
        }

        return result;
    }
    
}

