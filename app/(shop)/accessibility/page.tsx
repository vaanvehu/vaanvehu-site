import { getSettings } from "@/lib/catalog";
import PolicyPage, { PolicySection } from "@/components/shop/PolicyPage";

export const metadata = { title: "הצהרת נגישות | וְאַנְוֵהוּ" };

export default async function AccessibilityPage() {
  const settings = await getSettings();

  return (
    <PolicyPage title="הצהרת נגישות" updated="אוגוסט 2026">
      <PolicySection title="מחויבות לנגישות">
        <p>
          עסק וְאַנְוֵהוּ רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל הציבור, לרבות אנשים עם מוגבלות, ופועל
          להנגשת אתר האינטרנט שלו בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
          התשע״ג-2013, ובהתאם לתקן הישראלי (ת״י 5568) ברמת התאמה AA, המבוסס על הנחיות WCAG 2.0 הבינלאומיות.
        </p>
      </PolicySection>

      <PolicySection title="ההתאמות שבוצעו באתר">
        <ul className="list-disc pr-5 space-y-1.5">
          <li>ניווט מלא באמצעות מקלדת בכל מסכי האתר, כולל תפריטים, טפסים ועגלת הקנייה.</li>
          <li>ניגודיות צבעים נבחרה כך שתהיה קריאה נוחה, וטקסטים ניתנים להגדלה דרך הדפדפן ללא שבירת תצוגה.</li>
          <li>תוויות טקסט (alt) לתמונות משמעותיות, וסימון ברור של שדות חובה בטפסי ההזמנה ופרטי המשלוח.</li>
          <li>מבנה עמודים עקבי עם כותרות היררכיות, לתמיכה בקוראי מסך.</li>
          <li>תמיכה מלאה בכיווניות טקסט מימין לשמאל (RTL) בעברית.</li>
        </ul>
      </PolicySection>

      <PolicySection title="מגבלות ידועות">
        <p>
          חרף מאמצינו, ייתכן שיתגלו חלקים באתר שטרם הונגשו במלואם, למשל בתמונות המוצרים או ברכיבים גרפיים
          מסוימים. אנו ממשיכים לעבוד על שיפור הנגישות באופן שוטף, ונשמח לקבל כל הערה שתסייע לנו להשתפר.
        </p>
      </PolicySection>

      <PolicySection title="פנייה בנושא נגישות">
        <p>
          נתקלתם בבעיית נגישות באתר, או זקוקים לסיוע בביצוע הזמנה? ניתן לפנות אלינו ונשמח לספק מענה חלופי
          ולטפל בפנייה בהקדם:
        </p>
        <p className="mt-2">
          דוא״ל: <a href={`mailto:${settings.businessEmail}`} style={{ color: "var(--color-accent-700)" }}>{settings.businessEmail}</a>
          <br />
          וואטסאפ/טלפון: <span dir="ltr">{settings.whatsappNumber}</span>
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
