import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, MessageSquarePlus, Circle } from "lucide-react";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  client: string;
  status: TaskStatus;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
}

const statusLabel: Record<TaskStatus, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

const statusStyle: Record<TaskStatus, { color: string; bg: string }> = {
  "todo":        { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  "in-progress": { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  "done":        { color: "#00e5a0", bg: "rgba(0,229,160,0.1)" },
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const isDone = status === "done";
  const cfg = statusStyle[status];

  const markDone = () => {
    setStatus("done");
  };

  const saveNote = () => {
    if (!note.trim()) return;
    setNoteSaved(true);
    setTimeout(() => {
      setNoteOpen(false);
      setNoteSaved(false);
      setNote("");
    }, 1000);
  };

  return (
    <motion.div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{
        background: isDone ? "rgba(0,229,160,0.03)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: isDone ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 + 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Done indicator */}
            <motion.div
              className="mt-0.5 flex-shrink-0 cursor-pointer"
              onClick={markDone}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDone ? (
                <CheckCircle2 size={18} style={{ color: "var(--red)" }} />
              ) : (
                <Circle size={18} className="text-[var(--text-muted)]" />
              )}
            </motion.div>

            <div>
              <p
                className="font-body text-sm font-medium text-[var(--text-primary)]"
                style={{ textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.5 : 1 }}
              >
                {task.title}
              </p>
              <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">{task.client}</p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className="flex-shrink-0 font-body text-[10px] font-medium px-2 py-1 rounded-full"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {statusLabel[status]}
          </span>
        </div>

        {/* Due date */}
        <p className="font-body text-[11px] text-[var(--text-muted)] mb-4 ml-7">
          Due {task.dueDate}
        </p>

        {/* Actions */}
        <div className="flex gap-2 ml-7">
          <motion.button
            onClick={() => setNoteOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquarePlus size={12} />
            Add Note
          </motion.button>

          {!isDone && (
            <motion.button
              onClick={markDone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs border transition-all"
              style={{
                borderColor: "rgba(0,229,160,0.25)",
                color: "var(--red)",
                background: "rgba(0,229,160,0.06)",
              }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 12px rgba(0,229,160,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              <CheckCircle2 size={12} />
              Mark Done
            </motion.button>
          )}
        </div>

        {/* Note panel */}
        <AnimatePresence>
          {noteOpen && (
            <motion.div
              className="mt-4 ml-7"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note…"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-[var(--text-primary)] placeholder:text-white/25 focus:outline-none focus:border-[rgba(0,229,160,0.3)] resize-none transition-colors"
              />
              <div className="flex justify-end mt-2">
                <motion.button
                  onClick={saveNote}
                  className="font-body text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: noteSaved ? "rgba(0,229,160,0.15)" : "rgba(0,229,160,0.1)",
                    color: "var(--red)",
                    border: "1px solid rgba(0,229,160,0.2)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {noteSaved ? "Saved ✓" : "Save note"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export { type Task };
export default TaskCard;
