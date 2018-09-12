using Microsoft.AspNetCore.Html;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace DragonAdventure.Helpers {
    public static class FormatHelpers {
        public static HtmlString PrettyDate(DateTime date, string format = "M/d/yyyy h:mm:ss tt")
            => new HtmlString(date.ToString(format, CultureInfo.InvariantCulture).ToLower());

        public static HtmlString PrettyDuration(double time, string type) {
            TimeSpan? span = null;
            switch (type) {
                case "milliseconds": span = TimeSpan.FromMilliseconds(time); break;
                case "seconds":      span = TimeSpan.FromSeconds(time);      break;
                case "minutes":      span = TimeSpan.FromMinutes(time);      break;
                default: return new HtmlString("(invalid type)");
            }
            var str = string.Format("{0}:{1:D2}:{2:D2}",
                span.Value.Hours, span.Value.Minutes, span.Value.Seconds);
            return new HtmlString(str);
        }
    }
}