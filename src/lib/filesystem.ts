export type File = {
  type: 'file';
  content: string | (() => string | React.ReactNode);
};

export type Directory = {
  type: 'directory';
  parent: Directory | null;
  children: { [key: string]: Directory | File };
};

export type FileSystemNode = Directory | File;

const aboutContent = `
Ayush Das - Cybersecurity Enthusiast

I’m Ayush Das, a passionate Cybersecurity Enthusiast and BCA student focused on mastering both Offensive and Defensive Security techniques. My journey in tech began with a deep curiosity for bug hunting, ethical hacking, and OSINT investigations, which gradually evolved into building real-world cybersecurity projects that blend code, creativity, and problem-solving. I thrive on challenges and am constantly seeking opportunities to learn and grow in the ever-evolving field of cybersecurity.

---
## EDUCATION
- High School | Navjyoti Vidyalaya | 2021 | 84%
- Higher Secondary | The Dronacharya School | 2023 | 60%
- Undergraduation (BCA) | YCAT | 2026 | 8.4 SGPA

---
## KEY SKILLS
- Languages: Java, C, C++, Python, HTML, CSS, JS, React, PHP
- Platforms: Linux, AWS
- Tools: Git/GitHub, API Development
`;

const projectsContent = `
Here are the highlights of some of my projects. You can find more on my GitHub.

1. **Packet Sniffer based on Java**
   Developed a network packet sniffer in Java to capture, analyze, and display real-time network traffic, aiding in network monitoring and security analysis.

2. **Online Odisha eCommerce website**
   Designed and developed an e-commerce platform focused on selling traditional and locally-made clothing in Odisha.
   [Link: https://github.com/aayush-xid-su/ewebsite]

3. **Chess based encryption–decryption (C4Crypt)**
   A web-based encryption tool that converts text into chess move sequences using a custom cipher algorithm.
   [Link: https://github.com/aayush-xid-su/C4Crypt]

4. **Deck of card encryption–decryption (CardCrypt)**
   A web-based encryption tool that encodes messages using a card-based cipher mechanism.
   [Link: https://github.com/aayush-xid-su/CardCrypt]

5. **HTTP Server for Wireless File Transfer**
   Built a lightweight HTTP server to enable remote file transfer over a network without cables.
   [Link: https://github.com/aayush-xid-su/http-server]

---
You can view more projects on my GitHub profile: https://github.com/aayush-xid-su
`;

const resumeContent = `
# Ayush Das
Cybersecurity Enthusiast | aayushxidsu.11am@gmail.com | +91 7894038559 | linkedin.com/in/ayushdas-11am

## SUMMARY
Passionate Cybersecurity Enthusiast and BCA student skilled in Offensive and Defensive Security. Experienced in bug hunting, ethical hacking, and OSINT. Proven ability to build real-world cybersecurity projects.

## SKILLS
- **Languages:** Java, C, C++, Python, HTML, CSS, JavaScript, React, PHP
- **Platforms:** Linux, AWS
- **Tools:** Git, GitHub, API Development, Network Analysis Tools

## PROJECTS

### Packet Sniffer (Java)
Developed a network packet sniffer to capture and analyze real-time network traffic for security monitoring.

### Online Odisha eCommerce Website
Designed an e-commerce platform for traditional Odisha clothing.

### C4Crypt & CardCrypt
Created web-based encryption tools using custom chess and card-based cipher algorithms.

### HTTP Server for Wireless File Transfer
Built a lightweight HTTP server for seamless remote file sharing.

## EDUCATION
- **Bachelor of Computer Applications (BCA)** - YCAT (Expected 2026)
- **Higher Secondary** - The Dronacharya School (2023)
- **High School** - Navjyoti Vidyalaya (2021)

## CERTIFICATIONS & COURSES
- Cyber Job Simulation by Deloitte
- ANZ Cyber Security Management
- Tata Cybersecurity Analyst
- Mastercard Cybersecurity
`;


export const root: Directory = {
    type: 'directory',
    parent: null,
    children: {
        home: {
            type: 'directory',
            parent: null, // Will be set dynamically
            children: {
                ayush: {
                    type: 'directory',
                    parent: null, // Will be set dynamically
                    children: {
                        'about.md': {
                            type: 'file',
                            content: aboutContent,
                        },
                        'projects.md': {
                            type: 'file',
                            content: projectsContent,
                        },
                        'resume.md': {
                            type: 'file',
                            content: resumeContent,
                        },
                    },
                },
            },
        },
        admin: { type: 'directory', parent: null, children: {} },
        bin: { type: 'directory', parent: null, children: {} },
        etc: { type: 'directory', parent: null, children: {} },
        usr: { type: 'directory', parent: null, children: {} },
        root: { type: 'directory', parent: null, children: {} }, // This is the /root folder, not the FS root
    }
};

// Set parent references
(root.children.home as Directory).parent = root;
const homeDir = root.children.home as Directory;
(homeDir.children.ayush as Directory).parent = homeDir;

(root.children.admin as Directory).parent = root;
(root.children.bin as Directory).parent = root;
(root.children.etc as Directory).parent = root;
(root.children.usr as Directory).parent = root;
(root.children.root as Directory).parent = root;


// Function to find a node by path
export const findNode = (path: string, startNode: Directory = root): FileSystemNode | undefined => {
    const parts = path.split('/').filter(p => p && p !== '~');
    let currentNode: Directory = startNode;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const nextNode = currentNode.children[part];
        if (!nextNode) {
            return undefined; // Not found
        }
        if (nextNode.type === 'file') {
            return i === parts.length - 1 ? nextNode : undefined;
        }
        currentNode = nextNode;
    }
    return currentNode;
};


export const getPath = (node: Directory): string => {
    if (node.parent === null) {
      return '~';
    }
    const parentPath = getPath(node.parent);
    const nodeName = Object.keys(node.parent.children).find(
      key => node.parent!.children[key] === node
    );
    return parentPath === '~' ? `~/${nodeName}` : `${parentPath}/${nodeName}`;
};
