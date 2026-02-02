
import React, { useState, useEffect } from 'react';
import { Course, Module, Lesson, QuizQuestion } from '../types';
import { CirclePlay, CircleCheck, Lock, Clock, Trophy, ArrowLeft, Download, Share2, Award, UserCircle, FileText, CircleHelp, SquareCheck, Loader2, X } from './Icons';
import { supabase } from '../lib/supabase';
import { COURSES as MOCK_COURSES } from '../constants';

interface CoursesProps {
  initialCourseId?: string | null;
}

const Courses: React.FC<CoursesProps> = ({ initialCourseId }) => {
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showDiploma, setShowDiploma] = useState<boolean>(false);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('courses')
          .select(`*, modules (*, lessons (*))`)
          .eq('is_published', true);

        if (!error && data && data.length > 0) {
           // We would map real data here, but for now we fallback to mock
           setLocalCourses(MOCK_COURSES);
        } else {
           // Fallback if no data or error
           setLocalCourses(MOCK_COURSES);
        }
      } catch (error) {
        console.log('Using local content library due to connection error/demo mode.');
        setLocalCourses(MOCK_COURSES);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle Initial Course Selection (Deep Linking)
  useEffect(() => {
    if (initialCourseId && localCourses.length > 0) {
      const course = localCourses.find(c => c.id === initialCourseId);
      if (course) {
        handleStartCourse(course);
      }
    }
  }, [initialCourseId, localCourses]);

  const handleStartCourse = (course: Course) => {
    setActiveCourse(course);
    
    // Find the first uncompleted lesson, or default to the very first lesson
    let lessonToStart: Lesson | null = null;
    
    if (course.modules && course.modules.length > 0) {
        // Try to find first uncompleted
        for (const mod of course.modules) {
            const incomplete = mod.lessons.find(l => !l.isCompleted);
            if (incomplete) {
                lessonToStart = incomplete;
                break;
            }
        }
        // If all completed or none found, start at beginning
        if (!lessonToStart && course.modules[0].lessons.length > 0) {
            lessonToStart = course.modules[0].lessons[0];
        }
    }
    
    if (lessonToStart) {
        setActiveLesson(lessonToStart);
        resetLessonState();
    } else {
        console.warn("Course has no lessons to start.");
    }
  };

  const resetLessonState = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    resetLessonState();
  };

  const markLessonAsCompleted = (lessonId: string) => {
    if (!activeCourse) return;

    const updatedCourses = localCourses.map(course => {
      if (course.id !== activeCourse.id) return course;

      const updatedModules = course.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, isCompleted: true };
          }
          return lesson;
        })
      }));

      const totalLessons = updatedModules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = updatedModules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return { ...course, modules: updatedModules, progress };
    });

    setLocalCourses(updatedCourses);
    
    const updatedActiveCourse = updatedCourses.find(c => c.id === activeCourse.id) || null;
    setActiveCourse(updatedActiveCourse);
    
    // If there is an active lesson, ensure we update its reference from the new object
    if (updatedActiveCourse && activeLesson) {
        for (const m of updatedActiveCourse.modules) {
            const l = m.lessons.find(les => les.id === lessonId);
            if (l) { 
                setActiveLesson(l); 
                break; 
            }
        }
    }
  };

  const handleNextLesson = () => {
    if (!activeCourse || !activeLesson) return;
    
    let currentModuleIndex = -1;
    let currentLessonIndex = -1;

    activeCourse.modules.forEach((mod, mIdx) => {
      const lIdx = mod.lessons.findIndex(l => l.id === activeLesson.id);
      if (lIdx !== -1) {
        currentModuleIndex = mIdx;
        currentLessonIndex = lIdx;
      }
    });

    if (currentModuleIndex !== -1 && currentLessonIndex !== -1) {
      const currentModule = activeCourse.modules[currentModuleIndex];
      // Check if next lesson exists in current module
      if (currentLessonIndex < currentModule.lessons.length - 1) {
        handleLessonSelect(currentModule.lessons[currentLessonIndex + 1]);
        return;
      }
      // Check if next module exists
      if (currentModuleIndex < activeCourse.modules.length - 1) {
        const nextModule = activeCourse.modules[currentModuleIndex + 1];
        if (nextModule.lessons.length > 0) {
          handleLessonSelect(nextModule.lessons[0]);
          return;
        }
      }
    }
  };

  const handleCompleteCourse = () => {
    if (activeCourse && activeCourse.progress === 100) {
        setShowDiploma(true);
    }
  };

  const handleCloseDiploma = () => {
    setShowDiploma(false);
    setActiveCourse(null);
    setActiveLesson(null);
  };

  const handleQuizOptionSelect = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const submitQuiz = () => {
    if (!activeLesson?.questions) return;
    
    let allCorrect = true;
    activeLesson.questions.forEach(q => {
      const selected = quizAnswers[q.id];
      const correct = q.options.find(o => o.isCorrect)?.id;
      if (selected !== correct) allCorrect = false;
    });

    setQuizSubmitted(true);
    setQuizPassed(allCorrect);

    if (allCorrect) {
      markLessonAsCompleted(activeLesson.id);
    }
  };

  // -- Diploma View --
  if (showDiploma && activeCourse) {
    return (
      <div className="fixed inset-0 z-[60] bg-gray-900/95 dark:bg-space-950/95 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
         <div className="bg-white text-black w-full max-w-4xl aspect-[1.414/1] relative rounded-lg shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center border-8 border-double border-gold-600 my-8">
            <div className="text-center space-y-6 max-w-2xl w-full z-10">
               <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 uppercase tracking-wider mb-2">Diplom</h1>
               <p className="font-serif text-lg md:text-xl text-gray-600 italic">For vellykket gjennomføring av</p>
               <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">{activeCourse.title}</h3>
               <button onClick={handleCloseDiploma} className="mt-8 bg-gray-800 text-white px-6 py-2 rounded">Lukk</button>
            </div>
         </div>
      </div>
    );
  }

  // -- Active Course View --
  if (activeCourse) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
         <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={() => setActiveCourse(null)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-space-800"
            >
               <ArrowLeft size={20} /> Tilbake til oversikt
            </button>
            <div className="text-right">
               <h2 className="text-xl font-serif font-bold text-gold-600 dark:text-gold-400">{activeCourse.title}</h2>
               <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mt-1">
                  <span>{activeCourse.progress}% Fullført</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 pb-20">
               {activeLesson ? (
                 <div className="bg-white dark:bg-space-900 rounded-xl border border-gray-200 dark:border-space-800 overflow-hidden min-h-[400px] shadow-sm">
                    {/* Content Rendering based on Type */}
                    {activeLesson.type === 'video' && (
                       <div className="aspect-video bg-black relative flex items-center justify-center">
                          <button className="w-20 h-20 bg-gold-500/90 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform z-10">
                             <CirclePlay size={40} fill="currentColor" />
                          </button>
                       </div>
                    )}
                    
                    <div className="p-8">
                       <h3 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">{activeLesson.title}</h3>
                       
                       {activeLesson.type === 'quiz' ? (
                          <div className="space-y-6">
                             {activeLesson.questions?.map((q, idx) => (
                                <div key={q.id} className="bg-gray-50 dark:bg-space-950 p-6 rounded-xl border border-gray-200 dark:border-space-800">
                                   <p className="font-medium mb-3">{idx+1}. {q.question}</p>
                                   <div className="space-y-2">
                                      {q.options.map(opt => (
                                         <button 
                                            key={opt.id}
                                            onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                                            disabled={quizSubmitted}
                                            className={`w-full text-left p-3 rounded border ${
                                               quizSubmitted && opt.isCorrect ? 'bg-green-100 border-green-500 text-green-800' :
                                               quizAnswers[q.id] === opt.id ? 'bg-gold-50 border-gold-500' : 'bg-white dark:bg-space-900 border-gray-200 dark:border-space-700'
                                            }`}
                                         >
                                            {opt.text}
                                         </button>
                                      ))}
                                   </div>
                                </div>
                             ))}
                             <button onClick={submitQuiz} disabled={quizSubmitted} className="bg-gold-600 text-white px-6 py-2 rounded font-bold disabled:opacity-50">
                                {quizSubmitted ? 'Levert' : 'Lever Svar'}
                             </button>
                          </div>
                       ) : (
                          // Render text content with Markdown-like bolding support
                          <div className="prose prose-stone dark:prose-invert max-w-none">
                            {activeLesson.content?.split('\n').map((line, i) => {
                                // Simple header parsing
                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400 mt-6 mb-4">{line.replace('# ', '')}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-5 mb-3">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                if (line.startsWith('**') && line.includes(':')) {
                                    // Handle bold list items roughly
                                    const parts = line.split(':');
                                    return <p key={i} className="mb-2"><strong className="text-gray-900 dark:text-white">{parts[0].replace(/\*/g, '')}:</strong>{parts[1]}</p>
                                }
                                if (line.startsWith('* ')) return <li key={i} className="ml-4 mb-1">{line.replace('* ', '')}</li>;
                                
                                return <p key={i} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>
                            })}
                          </div>
                       )}

                       <div className="mt-8 flex justify-between pt-6 border-t border-gray-200 dark:border-space-800">
                          {!activeLesson.isCompleted && activeLesson.type !== 'quiz' && (
                             <button onClick={() => markLessonAsCompleted(activeLesson!.id)} className="text-green-600 font-medium flex items-center gap-2">
                                <SquareCheck size={18} /> Marker som ferdig
                             </button>
                          )}
                          <button onClick={handleNextLesson} className="ml-auto bg-gray-900 dark:bg-space-800 text-white px-4 py-2 rounded flex items-center gap-2">
                             Neste <CirclePlay size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center py-10 text-gray-500">Velg en leksjon fra menyen for å starte.</div>
               )}
            </div>

            {/* Sidebar Modules */}
            <div className="space-y-4 overflow-y-auto max-h-[80vh] pb-10">
               {activeCourse.modules.map((module, mIdx) => (
                  <div key={mIdx} className="space-y-2">
                     <h4 className="font-bold text-gray-700 dark:text-gray-300 px-2">{module.title}</h4>
                     <div className="space-y-1">
                        {module.lessons.map((lesson, lIdx) => (
                           <button 
                              key={lIdx}
                              onClick={() => handleLessonSelect(lesson)}
                              className={`w-full text-left p-3 rounded-lg text-sm flex items-start gap-3 transition-colors border ${
                                 activeLesson?.id === lesson.id
                                    ? 'bg-white dark:bg-space-800 border-gold-500/50 text-gold-600 dark:text-gold-100'
                                    : 'bg-gray-50 dark:bg-space-900/40 border-transparent text-gray-500'
                              }`}
                           >
                              <div className="mt-0.5">{lesson.type === 'video' ? <CirclePlay size={16} /> : <FileText size={16} />}</div>
                              <div className="flex-1">
                                 <p className="font-medium">{lesson.title}</p>
                                 <p className="text-[10px] opacity-60">{lesson.duration}</p>
                              </div>
                              {lesson.isCompleted && <CircleCheck size={14} className="text-green-500" />}
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  }

  // -- Catalog View --
  return (
    <div className="space-y-8 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Kurs & Sertifisering</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Læringssenter.</p>
        </div>
      </div>

      {loadingCourses ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-gold-500" size={48} />
        </div>
      ) : localCourses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Ingen kurs tilgjengelig.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
          {localCourses.map((course) => (
             <div key={course.id} className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="h-48 relative overflow-hidden bg-gray-800">
                   <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                   {course.progress > 0 && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                         <div className="h-full bg-green-500" style={{width: `${course.progress}%`}}></div>
                      </div>
                   )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">{course.title}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">{course.description}</p>
                   <button 
                      onClick={() => handleStartCourse(course)}
                      className="w-full py-2.5 rounded-lg font-bold text-sm bg-gold-600 text-white hover:bg-gold-700 transition-colors shadow-lg shadow-gold-900/20"
                   >
                      {course.progress > 0 ? 'Fortsett' : 'Start Kurs'}
                   </button>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
