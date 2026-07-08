/**
 * Script to migrate all lucide-react icons to @hugeicons/react
 * Run: node scripts/migrate-icons.cjs
 */
const fs = require('fs');
const path = require('path');

// Mapping of lucide-react icon names to @hugeicons/react icon names
const ICON_MAP = {
  // Arrow variants
  'ArrowRight': 'ArrowRightIcon',
  'ArrowLeft': 'ArrowLeftIcon',
  'ArrowUp': 'ArrowUpIcon',
  'ArrowDown': 'ArrowDownIcon',
  'ChevronDown': 'ChevronDownIcon',
  'ChevronLeft': 'ChevronLeftIcon',
  'ChevronRight': 'ChevronRightIcon',
  'ChevronUp': 'ChevronUpIcon',
  
  // Common UI
  'X': 'Cancel01Icon',
  'Menu': 'Menu01Icon',
  'Search': 'Search01Icon',
  'Filter': 'FilterIcon',
  'Settings': 'SettingsIcon',
  'Plus': 'PlusIcon',
  'Minus': 'MinusIcon',
  'Check': 'CheckmarkIcon',
  'CheckCircle2': 'CheckmarkCircle02Icon',
  'CheckCircle': 'CheckmarkCircleIcon',
  'AlertCircle': 'AlertCircleIcon',
  'AlertTriangle': 'AlertTriangleIcon',
  'Info': 'InfoIcon',
  'HelpCircle': 'HelpCircleIcon',
  'Loader2': 'Loading02Icon',
  
  // Navigation
  'Home': 'Home01Icon',
  'ExternalLink': 'ExternalLinkIcon',
  'Share2': 'Share02Icon',
  
  // Social / Communication
  'MessageCircle': 'Message01Icon',
  'MessageSquarePlus': 'MessageSquare01Icon',
  'Send': 'Send01Icon',
  'Mail': 'Mail01Icon',
  'Phone': 'PhoneIcon',
  'MessagesSquare': 'MessageSquare01Icon',
  
  // Shopping / E-commerce
  'ShoppingCart': 'ShoppingCart02Icon',
  'ShoppingBag': 'ShoppingBagIcon',
  'Package': 'PackageIcon',
  'PackageCheck': 'PackageCheckIcon',
  'Gift': 'GiftIcon',
  'Tags': 'TagsIcon',
  'Store': 'StoreIcon',
  
  // Health / Wellness
  'Heart': 'HeartIcon',
  'HeartPulse': 'HeartPulseIcon',
  'HeartHandshake': 'HeartHandshakeIcon',
  'Activity': 'ActivityIcon',
  'Brain': 'BrainIcon',
  'Footprints': 'FootprintsIcon',
  'Flame': 'FlameIcon',
  'Droplets': 'DropletIcon',
  'Apple': 'AppleIcon',
  'Salad': 'SaladIcon',
  'Pill': 'PillIcon',
  'Coffee': 'CoffeeIcon',
  'Timer': 'TimerIcon',
  
  // Nature
  'Leaf': 'Leaf01Icon',
  'TreePine': 'TreePineIcon',
  
  // Misc
  'Sparkles': 'SparklesIcon',
  'Zap': 'ZapIcon',
  'Star': 'StarIcon',
  'Target': 'TargetIcon',
  'Shield': 'Shield01Icon',
  'ShieldCheck': 'Shield01Icon',
  'Truck': 'DeliveryTruck01Icon',
  'MapPin': 'MapPinIcon',
  'Lock': 'LockIcon',
  'LockKeyhole': 'LockKeyholeIcon',
  'Eye': 'EyeIcon',
  'EyeOff': 'EyeOffIcon',
  'Sun': 'SunIcon',
  'Moon': 'MoonIcon',
  'Monitor': 'MonitorIcon',
  'User': 'UserIcon',
  'Users': 'UsersIcon',
  'UserCheck': 'UserCheckIcon',
  'LogOut': 'LogOut01Icon',
  'LogIn': 'LogInIcon',
  'BookOpen': 'BookOpenIcon',
  'FileText': 'FileTextIcon',
  'FileWarning': 'FileWarningIcon',
  'Image': 'ImageIcon',
  'Camera': 'CameraIcon',
  'Mic': 'Mic01Icon',
  'Trash2': 'TrashIcon',
  'Edit2': 'Edit02Icon',
  'Edit3': 'Edit03Icon',
  'Save': 'SaveIcon',
  'Upload': 'UploadIcon',
  'Download': 'DownloadIcon',
  'RefreshCw': 'RefreshIcon',
  'Play': 'PlayIcon',
  'Youtube': 'YoutubeIcon',
  'Construction': 'ConstructionIcon',
  'Cookie': 'CookieIcon',
  'Sliders': 'SlidersIcon',
  'Scale': 'ScaleIcon',
  'BarChart3': 'BarChart03Icon',
  'TrendingUp': 'TrendingUpIcon',
  'Rocket': 'RocketIcon',
  'Globe': 'GlobeIcon',
  'Briefcase': 'BriefcaseIcon',
  'Calendar': 'CalendarIcon',
  'CalendarCheck': 'CalendarCheckIcon',
  'Clock': 'ClockIcon',
  'Smile': 'SmileIcon',
  'Gem': 'GemIcon',
  'ThumbsUp': 'ThumbsUpIcon',
  'ThumbsDown': 'ThumbsDownIcon',
  'BadgeCheck': 'BadgeCheckIcon',
  'Smartphone': 'SmartphoneIcon',
  'Headphones': 'HeadphonesIcon',
  'Bot': 'BotIcon',
  'Circle': 'CircleIcon',
  'Instagram': 'InstagramIcon',
  'Facebook': 'FacebookIcon',
  'Dumbbell': 'Dumbbell01Icon',
  'HelpingHand': 'HelpingHandIcon',
  'MessageSquare': 'MessageSquare01Icon',
};

// Files to process
const SRC_DIR = path.join(__dirname, '..', 'src');
const filesToProcess = [];

function findFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findFiles(fullPath);
    } else if (entry.isFile() && /\.(jsx|js|tsx|ts)$/.test(entry.name)) {
      filesToProcess.push(fullPath);
    }
  }
}

findFiles(SRC_DIR);

let modifiedFiles = 0;

for (const filePath of filesToProcess) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Check if file imports from lucide-react
  if (!content.includes("from 'lucide-react'") && !content.includes('from "lucide-react"')) {
    continue;
  }

  console.log(`\n📄 Processing: ${path.relative(__dirname, filePath)}`);

  // Replace import line
  content = content.replace(
    /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g,
    (match, imports) => {
      const iconNames = imports.split(',').map(s => s.trim()).filter(Boolean);
      const hugeicons = iconNames.map(name => {
        const trimmed = name.trim();
        const mapped = ICON_MAP[trimmed];
        if (!mapped) {
          console.warn(`  ⚠️  No mapping found for: ${trimmed}`);
          return trimmed;
        }
        return mapped;
      });
      return `import { ${hugeicons.join(', ')} } from '@hugeicons/react';`;
    }
  );

  // Replace JSX usages: <IconName ...> → <NewIconName ...>
  for (const [oldName, newName] of Object.entries(ICON_MAP)) {
    // Replace <IconName (opening tag) - match <IconName followed by space, >, or /
    const openRegex = new RegExp(`<${oldName}(\\s|>|/)`, 'g');
    content = content.replace(openRegex, `<${newName}$1`);
    
    // Replace </IconName> (closing tag)
    const closeRegex = new RegExp(`</${oldName}>`, 'g');
    content = content.replace(closeRegex, `</${newName}>`);
  }

  // Remove strokeWidth props (hugeicons don't support them)
  content = content.replace(/\s+strokeWidth=\{[\d.]+\}/g, '');
  content = content.replace(/\s+strokeWidth=["'][\d.]+["']/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modifiedFiles++;
    console.log(`  ✅ Updated`);
  } else {
    console.log(`  ⏭️  No changes needed`);
  }
}

console.log(`\n\n✅ Migration complete!`);
console.log(`📊 Files modified: ${modifiedFiles}`);
console.log(`📊 Total files scanned: ${filesToProcess.length}`);
