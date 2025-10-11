import Typewriter from './typewriter';
import { ReactNode } from 'react';

type CommandOutputProps = {
  content: ReactNode;
  typingSpeed: number;
};

const CommandOutput = ({ content, typingSpeed }: CommandOutputProps) => {
  if (typeof content === 'string') {
    // For long static strings that need wrapping, a simple div is better.
    // The typewriter is best for dynamic, shorter text.
    if (content.length > 200 || content.includes('\n')) {
       return <div className="whitespace-pre-wrap">{content}</div>;
    }
    return <Typewriter text={content} speed={typingSpeed} />;
  }
  // If content is a React node, render it directly.
  return <div>{content}</div>;
};

export default CommandOutput;
