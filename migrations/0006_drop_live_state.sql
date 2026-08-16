-- Status de live agora é checado direto no YouTube a cada request
-- (functions/lib/youtube.ts, resolveChannelLiveState), sem cache em D1 —
-- WebSub/cron de reconciliação foram removidos junto.
DROP TABLE live_state;
