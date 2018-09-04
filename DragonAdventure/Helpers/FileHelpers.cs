using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;

namespace DragonAdventure.Helpers {
    public class FileHelpers {
        public static List<string> WwwFiles(string path, bool withPath = false) {
            path = path.Replace('/', '\\');
            while (path.StartsWith('\\'))
                path = path.Substring(1, path.Length - 1);
            var fullPath = Path.Combine("wwwroot", path);
            var files = Directory.EnumerateFiles(fullPath)
                .Select(x => (withPath
                    ? x.Substring(7, x.Length - 7)
                    : x.Substring(fullPath.Length + 1, x.Length - fullPath.Length - 1))
                .Replace('\\', '/'))
                .ToList();
            return files.ToList();
        }
    }
}