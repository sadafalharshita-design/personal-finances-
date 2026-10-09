import urllib.request
import re

req = urllib.request.Request("https://ai-finance-whatif.emergent.host/assets/index-B3rOCOcl.js", headers={"User-Agent": "Mozilla/5.0"})
content = urllib.request.urlopen(req).read().decode("utf-8", errors="ignore")

# Find all testId references
testids = re.findall(r'testId:[`"\']([^`"\']+)`', content) + re.findall(r'data-testid[`:\s=]+[`"\']([^`"\']+)`', content)
print("Found testids:", set(testids))

# Let's see all string templates or text chunks
# Let's inspect sections for each route
routes = ['/dashboard', '/accounts', '/transactions', '/budget', '/goals', '/scan', '/what-if']
for r in routes:
    print(f"\n==================== ROUTE: {r} ====================")
    idx = content.find(r)
    while idx != -1:
        chunk = content[max(0, idx-300):min(len(content), idx+500)]
        print("--- Chunk around", r, "---")
        # clean up chunk to print readable strings
        strings = re.findall(r'[`"\']([^`"\']{4,80})[`"\']', chunk)
        print("  Strings:", strings[:15])
        idx = content.find(r, idx + len(r) + 50)
        if idx > content.find(r) + 2000:
            break
