import React from 'react';
import { CommandContext } from './index';
import { Directory, FileSystemNode, findNode, getPath, root } from '@/lib/filesystem';

const getAbsolutePath = (path: string, currentPath: string): string[] => {
    if (path.startsWith('/')) {
        return path.split('/').filter(p => p);
    }
    const pathParts = currentPath === '~' ? [] : currentPath.replace('~/', '').split('/');
    return [...pathParts, ...path.split('/')].filter(p => p);
};


export const cd = async (args: string[], { currentDirectory, setCurrentDirectory, setCurrentPath, currentPath }: CommandContext) => {
    const path = args[0];
    if (!path) {
        setCurrentDirectory(root);
        setCurrentPath('~');
        return;
    }

    if (path === '..') {
        if (currentPath === '~') return;
        
        const pathParts = currentPath.replace('~/', '').split('/');
        pathParts.pop();

        if(pathParts.length === 0) {
            setCurrentDirectory(root);
            setCurrentPath('~');
            return;
        }

        const newPath = pathParts.join('/');
        const newNode = findNode(newPath);

        if (newNode && newNode.type === 'directory') {
            setCurrentDirectory(newNode);
            setCurrentPath(`~/${newPath}`);
        } else {
            return `cd: no such file or directory: ${newPath}`;
        }
        return;
    }
    
    const newPath = path.startsWith('~/') ? path.substring(2) : (currentPath === '~' ? path : `${currentPath.replace('~/', '')}/${path}`);
    const newNode = findNode(newPath);

    if (newNode && newNode.type === 'directory') {
        setCurrentDirectory(newNode);
        setCurrentPath(`~/${newPath}`);
    } else {
        return `cd: no such file or directory: ${path}`;
    }
};

export const ls = async (args: string[], { currentDirectory }: CommandContext) => {
    const showHidden = args.includes('-a');
    let content = Object.keys(currentDirectory.children);
    if (!showHidden) {
        content = content.filter(name => !name.startsWith('.'));
    }

    return (
        <div className="grid grid-cols-3 gap-x-4">
            {content.map(name => {
                const node = currentDirectory.children[name];
                const isDir = node.type === 'directory';
                return (
                    <span key={name} className={isDir ? 'text-blue-400' : ''}>
                        {name}{isDir ? '/' : ''}
                    </span>
                );
            })}
        </div>
    );
};

export const cat = async (args: string[], { currentDirectory }: CommandContext) => {
    const filename = args[0];
    if (!filename) {
        return 'Usage: cat [filename]';
    }

    const node = currentDirectory.children[filename];

    if (!node) {
        return `cat: ${filename}: No such file or directory`;
    }

    if (node.type === 'directory') {
        return `cat: ${filename}: Is a directory`;
    }
    
    if (typeof node.content === 'function') {
        return node.content();
    }

    return <pre className="whitespace-pre-wrap">{node.content}</pre>;
};

export const pwd = async (args: string[], { currentPath }: CommandContext) => {
    if (currentPath === '~') {
        return '/home/ayush';
    }
    return `/home/ayush/${currentPath.replace('~/', '')}`;
};
