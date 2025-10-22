  using System.Reflection;
  using KhzCeoTicketingApi.Application.Extensions;
  using Microsoft.AspNetCore.Mvc.Filters;

  public class FarsiStringNormalizationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Process all action arguments (typically your bound models)
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument != null)
                {
                    NormalizeStringsRecursively(argument);
                }
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // No-op: Nothing needed after action execution
        }

        private void NormalizeStringsRecursively(object obj)
        {
            if (obj == null) return;

            Type objType = obj.GetType();

            // Handle string properties directly on this object
            PropertyInfo[] stringProperties = objType
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.PropertyType == typeof(string) && p.CanRead && p.CanWrite)
                .ToArray();

            foreach (PropertyInfo property in stringProperties)
            {
                if (property.GetValue(obj) is string value && !string.IsNullOrEmpty(value))
                {
                    string normalized = NormalizeString(value);
                    property.SetValue(obj, normalized);
                }
            }

            // Recurse into nested complex objects (excluding strings and primitives)
            PropertyInfo[] complexProperties = objType
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.PropertyType.IsClass && p.PropertyType != typeof(string))
                .ToArray();

            foreach (PropertyInfo property in complexProperties)
            {
                object? childObj = property.GetValue(obj);
                if (childObj != null)
                {
                    NormalizeStringsRecursively(childObj);
                }
            }
        }

        private string NormalizeString(string input)
        {
            // Apply your custom chain: SafeFarsiStr().FixEnglishNumber()
            // Assuming these are extension methods; adjust if static
            return input.SafeFarsiStr().FixEnglishNumber();
        }
    }