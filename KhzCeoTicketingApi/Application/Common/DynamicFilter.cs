using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using KhzCeoTicketingApi.Application.Contract;

using System.Linq.Dynamic.Core;
namespace Application.Models;


public  static class DynamicFilter
{

        public static IQueryable<T> ApplyFilter<T>(IQueryable<T> source, List<FilterListItem> filters)
    {
        foreach (var f in filters)
        {
            var stringFilter = GetFilter(typeof(T), ToPascalCase(f.id), f.value);
            source = source.Where(stringFilter);
        }

        return source;
    }
    public static IQueryable<T> ApplySort<T>(IQueryable<T> source, SortItem sort)
    {

        if (sort == null)
            throw new Exception("Sort Not Initialize");

      source=  ApplySort(source, sort.id, sort.desc);


        return source;
    }

    public static IQueryable<T> ApplySort<T>(IQueryable<T> source, string sortBy, bool desc)
    {
        sortBy = ToPascalCase(sortBy);


        if (desc)
            source = source.OrderBy(sortBy + " desc");
        else
            source = source.OrderBy(sortBy);

        return source;
    }

    public static IQueryable<T> ApplySort<T>( IQueryable<T> source, SortItem sortBy, String defaultSort)
    {
        if (sortBy == null)
            return source.OrderBy(defaultSort + " desc ");


        sortBy.id= ToPascalCase( sortBy.id);



        if (sortBy.desc)
            source = source.OrderBy(sortBy.id + " desc");
        else
            source = source.OrderBy(sortBy.id);

        return source;
    }
    private static string ToPascalCase(string s)
    {


        // Find word parts using the following rules:
        // 1. all lowercase starting at the beginning is a word
        // 2. all caps is a word.
        // 3. first letter caps, followed by all lowercase is a word
        // 4. the entire string must decompose into words according to 1,2,3.
        // Note that 2&3 together ensure MPSUser is parsed as "MPS" + "User".

        var m = Regex.Match(s, "^(?<word>^[a-z]+|[A-Z]+|[A-Z][a-z]+)+$");
        var g = m.Groups["word"];

        // Take each word and convert individually to TitleCase
        // to generate the final output.  Note the use of ToLower
        // before ToTitleCase because all caps is treated as an abbreviation.
        var t = Thread.CurrentThread.CurrentCulture.TextInfo;
        var sb = new StringBuilder();
        foreach (var c in g.Captures.Cast<Capture>())
            sb.Append(t.ToTitleCase(c.Value.ToLower()));
        return sb.ToString();
    }



    public static String GetFilter(Type Model, String propery, String value)
    {

        PropertyInfo info = Model.GetProperty(propery);
        String PType = "";

        if (info == null)
        {
            var v = Model.GetProperties();

            info = Model.GetProperties().Where(d => d.Name.Contains(propery)).FirstOrDefault();
            if (info == null)
                PType = "System.String";

        }
        else
            PType = info.PropertyType.ToString();
        switch (PType)
        {
            case "System.String":
                return String.Format("{0}.Contains(\"{1}\")", propery, value);
            default:
                return String.Format("{0}={1}", propery, Int32.Parse(value));
        }

    }




}
