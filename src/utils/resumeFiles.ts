import { File, Paths } from 'expo-file-system';

export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

interface LocalResume {
  uri: string;
  name: string;
  size?: number | null;
}

export const getValidatedResumeFile = ({ uri, name, size }: LocalResume) => {
  const extension = name.split('.').pop()?.toLowerCase();
  if (extension !== 'pdf' && extension !== 'docx') {
    throw new Error('Only PDF and DOCX resumes are supported.');
  }

  const file = new File(uri);
  if (!file.exists) {
    throw new Error('This resume is no longer available on your device. Please select it again.');
  }
  const fileSize = size ?? file.size;
  if (fileSize > MAX_RESUME_SIZE_BYTES) {
    throw new Error('The resume exceeds the 10 MB upload limit.');
  }
  return file;
};

export const isResumeAvailable = (resume: LocalResume) => {
  try {
    getValidatedResumeFile(resume);
    return true;
  } catch {
    return false;
  }
};

export const persistProfileResume = (resume: LocalResume) => {
  const source = getValidatedResumeFile(resume);
  const extension = resume.name.split('.').pop()?.toLowerCase() ?? 'pdf';
  const destination = new File(
    Paths.document,
    `internlink-profile-resume-${Date.now()}.${extension}`,
  );
  source.copy(destination);
  return destination.uri;
};
